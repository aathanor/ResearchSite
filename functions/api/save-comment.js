export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Check if environment variables exist
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      throw new Error('Missing environment variables');
    }
    
    // Clone the request to avoid "body already used" error
    const clonedRequest = request.clone();
    const body = await clonedRequest.json();
    console.log('Request body:', body);
    
    const { docId, paraIndex, comment: originalComment, highlightedText, contextBefore, contextAfter } = body;
    
    // Handle comment removal
    if (body.remove || body.action === 'remove') {
      const timestamp = body.timestamp;
      
      // Fetch content list
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
          error: `No markdown files found in content directory`,
          details: `Looked in: ${contentUrl}`
        }), {
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      // Find the specific file or use the first one
      let actualFilename = mdFiles.find(file => file.name === docId)?.name || mdFiles[0].name;
      console.log('Using file for removal:', actualFilename);
      
      // Fetch file content
      const fileUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${actualFilename}`;
      console.log('Fetching file from GitHub for removal:', fileUrl);
      
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
          details: `Tried to access: ${fileUrl}`
        }), {
          status: 404,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      
      const fileData = await getResponse.json();
      console.log('File fetched successfully for removal');
      
      // Decode and remove comment
      let content = atob(fileData.content.replace(/\n/g, ''));
      const removeRegex = new RegExp(`<!--\\s*[?!✓]\\s*.*?\\s*\\|\\s*.*?\\s*\\|\\s*${timestamp}\\s*(?:\\|\\s*.*?\\s*)?\\s*-->`, 'g');
      const originalLength = content.length;
      content = content.replace(removeRegex, '');
      console.log(`Content length changed from ${originalLength} to ${content.length}`);
      
      // Update file on GitHub
      console.log('Attempting to update file on GitHub for removal...');
      const updateResponse = await fetch(fileUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
          'User-Agent': 'Cloudflare-Worker'
        },
        body: JSON.stringify({
          message: `Remove comment from ${actualFilename}`,
          content: btoa(unescape(encodeURIComponent(content))),
          sha: fileData.sha,
          committer: {
            name: 'Research Comments',
            email: 'comments@research.project'
          }
        })
      });
      
      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('GitHub update error for removal:', updateResponse.status, errorText);
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
      
      console.log('GitHub removal successful');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Comment removed successfully' 
      }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Handle comment addition (ADD LOGIC)
    if (!originalComment) {
      return new Response(JSON.stringify({ 
        error: 'Missing comment data' 
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
    let actualFilename = mdFiles.find(file => file.name === docId)?.name || mdFiles[0].name;
    console.log('Using file for addition:', actualFilename);

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
    console.log('File fetched successfully for addition');
    
    // Decode the content
    let content = atob(fileData.content.replace(/\n/g, ''));
    
    // Find where to insert the comment
    // Strategy: find the highlighted text and insert comment nearby
    if (highlightedText && content.includes(highlightedText)) {
      const textIndex = content.indexOf(highlightedText);
      const beforeText = content.substring(0, textIndex);
      const afterText = content.substring(textIndex + highlightedText.length);
      
      // Insert comment after the highlighted text
      content = beforeText + highlightedText + ' ' + originalComment + afterText;
      console.log('Inserted comment after highlighted text');
    } else {
      // Fallback: append comment to the end of the file
      content += '\n\n' + originalComment;
      console.log('Appended comment to end of file');
    }
    
    // Update the file on GitHub
    console.log('Attempting to update file on GitHub...');
    const updateResponse = await fetch(fileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker'
      },
      body: JSON.stringify({
        message: `Add comment to ${actualFilename}`,
        content: btoa(unescape(encodeURIComponent(content))),
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
      message: 'Comment added successfully',
      commit: updateResult.commit.sha
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