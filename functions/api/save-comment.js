export async function onRequestPost(context) {

  // COMPLETELY SAFE VERSION - Use this in ALL files:

  function stripSectionNumbers(content) {
      // Remove "1. ", "1.2. ", "1.2.3. " etc. from headers
      return content.replace(/^(#{1,6})\s+(\d+(?:\.\d+)*)\.\s+/gm, '$1 ');
  }

function decodeGitHubContent(base64Content) {
    try {
        const cleanBase64 = base64Content.replace(/\n/g, '');
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        let content = new TextDecoder('utf-8').decode(bytes);
        content = fixCommonEncodingIssues(content);
        return content;
    } catch (error) {
        console.warn('UTF-8 decoding failed, trying fallback method:', error);
        try {
            let content = atob(base64Content.replace(/\n/g, ''));
            content = fixCommonEncodingIssues(content);
            return content;
        } catch (fallbackError) {
            throw new Error('Could not decode content');
        }
    }
}

function fixCommonEncodingIssues(text) {
    let fixedText = text;
    
    // Em dash fixes using Unicode escape sequences
    fixedText = fixedText.replace(/\u00e2\u0080\u0094/g, '\u2014'); // â€" -> —
    fixedText = fixedText.replace(/\u00e2/g, '\u2014'); // â -> —
    
    // Quote fixes using Unicode escape sequences  
    fixedText = fixedText.replace(/\u00e2\u0080\u009c/g, '\u201c'); // â€œ -> "
    fixedText = fixedText.replace(/\u00e2\u0080\u009d/g, '\u201d'); // â€ -> "
    fixedText = fixedText.replace(/\u00e2\u0080\u0098/g, '\u2018'); // â€˜ -> '
    fixedText = fixedText.replace(/\u00e2\u0080\u0099/g, '\u2019'); // â€™ -> '
    
    // Ellipsis fix
    fixedText = fixedText.replace(/\u00e2\u0080\u00a6/g, '\u2026'); // â€¦ -> …
    
    // Clean up Â characters
    fixedText = fixedText.replace(/\u00c2 /g, ' '); // Â  -> space
    fixedText = fixedText.replace(/\u00c2\*/g, '*'); // Â* -> *
    fixedText = fixedText.replace(/\*\u00c2/g, '*'); // *Â -> *
    fixedText = fixedText.replace(/\u00c2_/g, '_'); // Â_ -> _  
    fixedText = fixedText.replace(/_\u00c2/g, '_'); // _Â -> _
    fixedText = fixedText.replace(/\u00c2/g, ''); // Remove remaining Â
    
    // Space cleanup
    fixedText = fixedText.replace(/  +/g, ' '); // Multiple spaces -> single space
    fixedText = fixedText.replace(/ +\n/g, '\n'); // Spaces before newline
    fixedText = fixedText.replace(/\n +/g, '\n'); // Spaces after newline
    
    return fixedText;
}

// FOR save-comment.js ONLY - also add this encoding function:
function encodeContentForGitHub(content) {
    try {
        const utf8Bytes = new TextEncoder().encode(content);
        let binaryString = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
            binaryString += String.fromCharCode(utf8Bytes[i]);
        }
        return btoa(binaryString);
    } catch (error) {
        console.warn('UTF-8 encoding failed, trying fallback:', error);
        return btoa(unescape(encodeURIComponent(content)));
    }
}

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
  
    let content = decodeGitHubContent(fileData.content);
    
    console.log('Original content length:', content.length);
    console.log('Content sample after decoding:', content.substring(0, 200));
    
    let commitMessage = '';
    
    // Handle different actions
    switch (action) {
      case 'add':
        content = addFootnoteComment(content, processedComment, footnoteRef, selectedText, beforeContext, afterContext);
        commitMessage = `Add comment to ${actualFilename} [skip ci]`;
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
        commitMessage = `Update comment in ${actualFilename} [skip ci]`;
        break;
        
      case 'delete':
        content = deleteFootnoteComment(content, processedComment);
        commitMessage = `Delete comment from ${actualFilename} [skip ci]`;
        break;
        
      default:
        // Default to add for backward compatibility
        content = addFootnoteComment(content, processedComment, footnoteRef, selectedText, beforeContext, afterContext);
        commitMessage = `Add comment to ${actualFilename} [skip ci]`;
        break;
    }
    
    console.log('Modified content length:', content.length);
    content = stripSectionNumbers(content);
    // Update the file on GitHub
    console.log('Attempting to update file on GitHub...');
    console.log('Content length before encoding:', content.length);
    console.log('Content sample before encoding:', content.substring(0, 200));
    
    // FIXED: Proper UTF-8 encoding for GitHub API
    const encodedContent = encodeContentForGitHub(content);
    
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
// Add footnote comment to content
function addFootnoteComment(content, footnoteDefinition, footnoteRef, selectedText, beforeContext, afterContext) {
  console.log('Adding footnote:', { footnoteDefinition, footnoteRef, selectedText });
  
  if (!footnoteRef || !selectedText) {
    console.error('Missing footnoteRef or selectedText');
    return content;
  }
  
  const cleanSelectedText = selectedText.trim();
  let insertionIndex = -1;
  
  // Strategy 1: For long selections (>6 words), use last 5 words as anchor
  const words = cleanSelectedText.split(/\s+/);
  if (words.length > 6) {
    const lastWords = words.slice(-5).join(' ');
    console.log('Long selection detected, using last 5 words as anchor:', lastWords);
    
    // Try to find these last words (with various markdown wrappers)
    const variations = [
      lastWords,
      `\`${lastWords}\``,
      `**${lastWords}**`,
      `*${lastWords}*`
    ];
    
    for (const variation of variations) {
      insertionIndex = content.indexOf(variation);
      if (insertionIndex !== -1) {
        insertionIndex = insertionIndex + variation.length;
        console.log('Found last words with variation, inserting at:', insertionIndex);
        break;
      }
    }
    
    // If still not found, try fuzzy matching on last words
    if (insertionIndex === -1) {
      const lastWordsPattern = lastWords.split(/\s+/).map(w => 
        w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      ).join('\\s+');
      const regex = new RegExp(lastWordsPattern, 'i');
      const match = content.match(regex);
      if (match) {
        const matchIndex = content.indexOf(match[0]);
        insertionIndex = matchIndex + match[0].length;
        // Check for closing backtick
        if (content.charAt(insertionIndex) === '`') {
          insertionIndex++;
        }
        console.log('Found last words via fuzzy match, inserting at:', insertionIndex);
      }
    }
  }
  
  // Strategy 2: For short selections, try exact match with wrappers
  if (insertionIndex === -1) {
    const variations = [
      cleanSelectedText,
      `\`${cleanSelectedText}\``,
      `**${cleanSelectedText}**`,
      `*${cleanSelectedText}*`,
      `***${cleanSelectedText}***`,
      `_${cleanSelectedText}_`,
      `__${cleanSelectedText}__`
    ];
    
    for (const variation of variations) {
      insertionIndex = content.indexOf(variation);
      if (insertionIndex !== -1) {
        insertionIndex = insertionIndex + variation.length;
        console.log('Found exact text with wrapper, inserting at:', insertionIndex);
        break;
      }
    }
  }
  
  // Strategy 3: Use context if available
  if (insertionIndex === -1 && beforeContext && afterContext) {
    const beforeIndex = content.indexOf(beforeContext.trim());
    if (beforeIndex !== -1) {
      const searchStart = beforeIndex + beforeContext.trim().length;
      const searchText = words.length > 6 ? words.slice(-5).join(' ') : cleanSelectedText;
      const afterBeforeIndex = content.indexOf(searchText, searchStart);
      
      if (afterBeforeIndex !== -1) {
        insertionIndex = afterBeforeIndex + searchText.length;
        if (content.charAt(insertionIndex) === '`') insertionIndex++;
        console.log('Found using context, inserting at:', insertionIndex);
      }
    }
  }
  
  // Strategy 4: Last resort - find a safe location (NOT at end of document)
  if (insertionIndex === -1) {
    console.warn('Could not locate text, using safe fallback');
    
    // Skip frontmatter
    let searchStart = 0;
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      searchStart = frontmatterEnd + 3;
    }
    
    // Find end of first paragraph after frontmatter
    const remainingContent = content.substring(searchStart);
    const firstParagraphEnd = remainingContent.indexOf('\n\n');
    
    if (firstParagraphEnd !== -1) {
      insertionIndex = searchStart + firstParagraphEnd;
    } else {
      // Use middle of document instead of end
      insertionIndex = Math.floor(content.length * 0.3);
    }
    
    console.log('Using fallback insertion at:', insertionIndex);
  }
  
  // Insert footnote reference
  if (insertionIndex !== -1 && insertionIndex <= content.length) {
    const beforeText = content.substring(0, insertionIndex);
    const afterText = content.substring(insertionIndex);
    content = beforeText + footnoteRef + afterText;
    console.log('Successfully inserted footnote reference at position:', insertionIndex);
  } else {
    console.error('Invalid insertion point, appending at safe location');
    const safePoint = content.indexOf('\n\n') > 0 ? content.indexOf('\n\n') : content.length * 0.3;
    content = content.substring(0, safePoint) + footnoteRef + content.substring(safePoint);
  }
  
  // Add footnote definition at the end
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
    // Fallback: treat as orphan definition body and remove matching line
    const escapedDef = footnoteDefinition.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const orphanPattern = new RegExp(`\\n?\\s*${escapedDef}\\s*`, 'g');
    content = content.replace(orphanPattern, '');
    return content;  // Early return since no ref to remove
  }
  
  const ref = match[1];
  
  // Remove footnote reference [^n] from content
  const refPattern = new RegExp(`\\[${ref.replace(/[\[\]^]/g, '\\$&')}\\](?!:)`, 'g');
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