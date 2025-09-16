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
    
    if (body.remove) {
      const timestamp = body.timestamp;
      // Fetch content list (reuse from add path)
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
      
      const actualFilename = mdFiles[0].name;
      console.log('Using file for removal:', actualFilename);
      
      // Fetch file
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
      
      // Decode and remove
      let content = atob(fileData.content.replace(/\n/g, ''));
      const removeRegex = new RegExp(`<!--\\s*[?!\\u2713]\\s*.*?\\s*\\|\\s*.*?\\s*\\|\\s*${timestamp}\\s*(?:\\|\\s*.*?\\s*)?\\s*-->`, 'g');
      content = content.replace(removeRegex, '');
      
      // PUT updated content
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
      return new Response(JSON.stringify({ success: true, message: 'Comment removed' }), {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // ... (keep the rest of the add logic unchanged)
    
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