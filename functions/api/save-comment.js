export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Check if environment variables exist
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      throw new Error('Missing environment variables');
    }
    
    // Extract user from Cloudflare Access JWT
    let authenticatedUser = 'anonymous';
    const jwtAssertion = request.headers.get('cf-access-jwt-assertion');
    
    if (jwtAssertion) {
      try {
        console.log('Extracting user from JWT assertion...');
        const parts = jwtAssertion.split('.');
        if (parts.length === 3) {
          const payload = parts[1];
          const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
          const decoded = atob(paddedPayload);
          const userInfo = JSON.parse(decoded);
          
          authenticatedUser = userInfo.email || 
                             userInfo.user_email ||
                             userInfo.preferred_username ||
                             userInfo.upn ||
                             userInfo.name ||
                             userInfo.sub ||
                             'anonymous';
          
          console.log('Authenticated user:', authenticatedUser);
        }
      } catch (jwtError) {
        console.warn('Could not extract user from JWT:', jwtError.message);
      }
    } else {
      console.log('No JWT assertion found, using anonymous');
    }
    
    // Clone the request to avoid "body already used" error
    const clonedRequest = request.clone();
    const body = await clonedRequest.json();
    console.log('Request body:', body);
    
    const { docId, comment, oldComment, footnoteRef, selectedText, beforeContext, afterContext, type, action } = body;
    
    // Replace 'anonymous' in comment with authenticated user
    let processedComment = comment;
    if (comment && comment.includes(':anonymous:') && authenticatedUser !== 'anonymous') {
      processedComment = comment.replace(':anonymous:', `:${authenticatedUser}:`);
      console.log('Updated comment with authenticated user:', processedComment);
    }
    
    if (type !== 'footnote') {
      return new Response(JSON.stringify({ 
        error: 'Only footnote comments are supported' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Fetch content list to find the actual file
    const contentUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content`;
    console.log('Fetching content list from:', contentUrl);
    
    const contentResponse = await fetch(contentUrl, {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare-Worker'
      }
    });
    
    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error('GitHub content fetch error:', contentResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Cannot access content directory`,
        details: errorText
      }), {
        status: contentResponse.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const contentData = await contentResponse.json();
    const mdFiles = contentData.filter(file => file.name.endsWith('.md'));
    
    if (mdFiles.length === 0) {
      return new Response(JSON.stringify({ 
        error: `No markdown files found in content directory`
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Find the specific file or use the first one
    let actualFilename = mdFiles.find(file => file.name === docId)?.name || 
                        mdFiles.find(file => file.name.includes(docId))?.name ||
                        mdFiles[0].name;
    console.log('Using file:', actualFilename);

    // Fetch the current file content
    const fileUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${actualFilename}`;
    console.log('Fetching file from GitHub:', fileUrl);
    
    const getResponse = await fetch(fileUrl, {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare-Worker'
      }
    });
    
    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      console.error('GitHub file fetch error:', getResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `File not found: ${actualFilename}`,
        details: errorText
      }), {
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const fileData = await getResponse.json();
    console.log('File fetched successfully');
    
    // Decode the content
    let content;
    try {
      // FIXED: Proper UTF-8 decoding from GitHub API
      const base64Content = fileData.content.replace(/\n/g, '');
      console.log('Base64 content length:', base64Content.length);
      
      // Use modern decoding approach to avoid corruption
      const binaryString = atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      content = new TextDecoder('utf-8').decode(bytes);
      console.log('Content decoded successfully with UTF-8');
    } catch (error) {
      console.error('UTF-8 decoding failed, falling back to old method:', error);
      // Fallback to old method if new one fails
      content = atob(fileData.content.replace(/\n/g, ''));
    }
    
    console.log('Original content length:', content.length);
    console.log('Content sample after decoding:', content.substring(0, 200));
    
    let commitMessage = '';
    
    // Handle different actions
    switch (action) {
      case 'add':
        content = addFootnoteComment(content, processedComment, footnoteRef, selectedText, beforeContext, afterContext);
        commitMessage = `Add comment to ${actualFilename}`;
        break;
        
      case 'update':
        if (!oldComment) {
          return new Response(JSON.stringify({ 
            error: 'oldComment required for update action' 
          }), {
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
        content = updateFootnoteComment(content, oldComment, processedComment);
        commitMessage = `Update comment in ${actualFilename}`;
        break;
        
      case 'delete':
        content = deleteFootnoteComment(content, processedComment);
        commitMessage = `Delete comment from ${actualFilename}`;
        break;
        
      default:
        // Default to add for backward compatibility
        content = addFootnoteComment(content, processedComment, footnoteRef, selectedText, beforeContext, afterContext);
        commitMessage = `Add comment to ${actualFilename}`;
        break;
    }
    
    console.log('Modified content length:', content.length);
    
    // Update the file on GitHub
    console.log('Attempting to update file on GitHub...');
    console.log('Content length before encoding:', content.length);
    console.log('Content sample before encoding:', content.substring(0, 200));
    
    // FIXED: Proper UTF-8 encoding for GitHub API
    let encodedContent;
    try {
      // Use modern encoding approach to avoid corruption
      const utf8Bytes = new TextEncoder().encode(content);
      encodedContent = btoa(String.fromCharCode.apply(null, utf8Bytes));
      console.log('Content encoded successfully with UTF-8');
    } catch (error) {
      console.error('UTF-8 encoding failed, falling back to old method:', error);
      // Fallback to old method if new one fails
      encodedContent = btoa(unescape(encodeURIComponent(content)));
    }
    
    const updateResponse = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: encodedContent,
        sha: fileData.sha,
        committer: {
          name: 'Research Comments',
          email: 'comments@research.project'
        }
      })
    });
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('GitHub update error:', updateResponse.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Failed to update file: ${updateResponse.status}`,
        details: errorText
      }), {
        status: updateResponse.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const updateResult = await updateResponse.json();
    console.log('GitHub update successful:', updateResult.commit.sha);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Comment ${action}ed successfully`,
      commit: updateResult.commit.sha,
      action: action,
      authenticatedUser: authenticatedUser,
      userWasAuthenticated: authenticatedUser !== 'anonymous'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Function error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}

// Add footnote comment to content
function addFootnoteComment(content, footnoteDefinition, footnoteRef, selectedText, beforeContext, afterContext) {
  console.log('Adding footnote:', { footnoteDefinition, footnoteRef, selectedText, beforeContext, afterContext });
  
  if (!footnoteRef || !selectedText) {
    console.error('Missing footnoteRef or selectedText');
    return content;
  }
  
  // Clean the selected text and contexts
  const cleanSelectedText = selectedText.trim();
  const cleanBeforeContext = beforeContext ? beforeContext.trim() : '';
  const cleanAfterContext = afterContext ? afterContext.trim() : '';
  
  let insertionIndex = -1;
  
  // Strategy 1: Try to find the exact selected text
  insertionIndex = content.indexOf(cleanSelectedText);
  if (insertionIndex !== -1) {
    console.log('Found exact selected text at:', insertionIndex);
    // FIXED: Insert footnote reference AFTER the selected text, not before
    insertionIndex = insertionIndex + cleanSelectedText.length;
    console.log('Will insert footnote reference after selection at:', insertionIndex);
  }
  
  // Strategy 2: Use before and after context to find the location
  if (insertionIndex === -1 && cleanBeforeContext && cleanAfterContext) {
    // Try to find the pattern: beforeContext + selectedText + afterContext
    const pattern = cleanBeforeContext + cleanSelectedText + cleanAfterContext;
    const patternIndex = content.indexOf(pattern);
    if (patternIndex !== -1) {
      insertionIndex = patternIndex + cleanBeforeContext.length + cleanSelectedText.length;
      console.log('Found using full context, inserting after selection at:', insertionIndex);
    }
  }
  
  // Strategy 3: Use just before context
  if (insertionIndex === -1 && cleanBeforeContext) {
    const beforeIndex = content.indexOf(cleanBeforeContext);
    if (beforeIndex !== -1) {
      // Find the selected text after the before context
      const afterBeforeIndex = beforeIndex + cleanBeforeContext.length;
      const remainingContent = content.substring(afterBeforeIndex);
      const selectedInRemaining = remainingContent.indexOf(cleanSelectedText);
      if (selectedInRemaining !== -1) {
        insertionIndex = afterBeforeIndex + selectedInRemaining + cleanSelectedText.length;
        console.log('Found using before context, inserting after selection at:', insertionIndex);
      }
    }
  }
  
  // Strategy 4: Try partial matching of selected text (first few words)
  if (insertionIndex === -1) {
    const words = cleanSelectedText.split(/\s+/);
    if (words.length >= 2) {
      for (let i = Math.min(words.length, 3); i >= 2; i--) {
        const partialText = words.slice(0, i).join(' ');
        const partialIndex = content.indexOf(partialText);
        if (partialIndex !== -1) {
          // Try to find the full selected text starting from this partial match
          const remainingContent = content.substring(partialIndex);
          const fullMatch = remainingContent.indexOf(cleanSelectedText);
          if (fullMatch !== -1 && fullMatch < 50) { // Within reasonable distance
            insertionIndex = partialIndex + fullMatch + cleanSelectedText.length;
            console.log('Found using partial text, inserting after selection at:', insertionIndex);
            break;
          } else {
            // Fallback: insert after partial match
            insertionIndex = partialIndex + partialText.length;
            console.log('Found using partial text fallback at:', insertionIndex);
            break;
          }
        }
      }
    }
  }
  
  // Strategy 5: Find a similar text pattern (case-insensitive, punctuation-tolerant)
  if (insertionIndex === -1) {
    const normalizedSelected = cleanSelectedText.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
    const contentWords = content.toLowerCase().match(/\w+/g) || [];
    const selectedWords = normalizedSelected.split(' ').filter(w => w.length > 0);
    
    if (selectedWords.length >= 2) {
      // Find sequence of words in content
      for (let i = 0; i <= contentWords.length - selectedWords.length; i++) {
        const contentSlice = contentWords.slice(i, i + selectedWords.length);
        if (JSON.stringify(contentSlice) === JSON.stringify(selectedWords)) {
          // Found the word sequence, now find it in original content
          const regex = new RegExp(selectedWords.map(w => `\\b${w}\\b`).join('\\s+'), 'i');
          const match = content.match(regex);
          if (match) {
            const matchIndex = content.indexOf(match[0]);
            insertionIndex = matchIndex + match[0].length;
            console.log('Found using word sequence, inserting after match at:', insertionIndex);
            break;
          }
        }
      }
    }
  }
  
  // Strategy 6: Last resort - find a reasonable location (NOT at the beginning)
  if (insertionIndex === -1) {
    console.warn('Could not locate selected text, using fallback strategy');
    
    // Skip frontmatter
    let searchStart = 0;
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      searchStart = frontmatterEnd + 3;
    }
    
    // Find the end of the first meaningful paragraph after frontmatter
    const remainingContent = content.substring(searchStart);
    const firstParagraphEnd = remainingContent.indexOf('\n\n');
    
    if (firstParagraphEnd !== -1) {
      insertionIndex = searchStart + firstParagraphEnd;
    } else {
      // Find end of first sentence after frontmatter
      const sentenceEnd = remainingContent.search(/[.!?]\s/);
      if (sentenceEnd !== -1) {
        insertionIndex = searchStart + sentenceEnd + 1;
      } else {
        // Very last resort - middle of document
        insertionIndex = Math.floor(content.length / 2);
      }
    }
    
    console.log('Using fallback insertion at:', insertionIndex);
  }
  
  // Insert footnote reference at the found position
  if (insertionIndex !== -1 && insertionIndex <= content.length) {
    const beforeText = content.substring(0, insertionIndex);
    const afterText = content.substring(insertionIndex);
    content = beforeText + footnoteRef + afterText;
    console.log('Successfully inserted footnote reference AFTER selected text at position:', insertionIndex);
  } else {
    console.error('Could not find valid insertion point, appending at end');
    content = content.trim() + footnoteRef;
  }
  
  // Add footnote definition at the end of the content
  if (!content.endsWith('\n')) {
    content += '\n';
  }
  content += '\n' + footnoteDefinition;
  
  console.log('Footnote added successfully');
  return content;
}

// Update footnote comment in content
function updateFootnoteComment(content, oldFootnoteDefinition, newFootnoteDefinition) {
  console.log('Updating footnote:', { old: oldFootnoteDefinition, new: newFootnoteDefinition });
  
  // Find and replace the old footnote definition with the new one
  const oldDefIndex = content.indexOf(oldFootnoteDefinition);
  if (oldDefIndex === -1) {
    console.error('Old footnote definition not found:', oldFootnoteDefinition);
    // Fallback: just add the new definition
    return addFootnoteComment(content, newFootnoteDefinition);
  }
  
  content = content.replace(oldFootnoteDefinition, newFootnoteDefinition);
  
  console.log('Footnote updated successfully');
  return content;
}

// Delete footnote comment from content
function deleteFootnoteComment(content, footnoteDefinition) {
  console.log('Deleting footnote:', footnoteDefinition);
  
  // Parse footnote to get the reference
  const match = footnoteDefinition.match(/^\[(\^[^\]]+)\]:/);
  if (!match) {
    console.error('Invalid footnote format for deletion:', footnoteDefinition);
    return content;
  }
  
  const ref = match[1];
  
  // Remove footnote reference [^n] from content
  const refPattern = new RegExp(`\\[${ref.replace(/[\[\]^]/g, '\\$&')}\\]`, 'g');
  content = content.replace(refPattern, '');
  
  // Remove footnote definition from content
  const defPattern = new RegExp(`\\n?\\[${ref.replace(/[\[\]^]/g, '\\$&')}\\]:\\s*[^\\n]*`, 'g');
  content = content.replace(defPattern, '');
  
  // Clean up extra newlines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  console.log('Footnote deleted successfully');
  return content;
}

// Handle OPTIONS request for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}