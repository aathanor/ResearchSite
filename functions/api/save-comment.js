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
    
    const { filename, paraIndex, docId, comment: originalComment } = body;
    
    // Get JWT from headers
    const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
    let author = 'anonymous';
    
    // Fetch identity only once
    if (jwt) {
      const identityUrl = 'https://aathanor.cloudflareaccess.com/cdn-cgi/access/get-identity';
      console.log('Fetching identity from:', identityUrl);
      
      try {
        const identityResponse = await fetch(identityUrl, {
          headers: { 'Cf-Access-Jwt-Assertion': jwt }
        });
        
        console.log('Identity response status:', identityResponse.status);
        
        if (identityResponse.ok) {
          const identity = await identityResponse.json();
          console.log('Identity data:', JSON.stringify(identity));
          author = identity.email || author;
        } else {
          const errorText = await identityResponse.text();
          console.error('Identity fetch failed:', identityResponse.status, errorText);
        }
      } catch (identityError) {
        console.error('Error fetching identity:', identityError);
      }
    }
    
    console.log('Final author:', author);
    
    // Process comment to replace "anonymous" with actual author
    let processedComment = originalComment;
    if (processedComment.includes('anonymous')) {
      processedComment = processedComment.replace('anonymous', author);
    }
    
    console.log('Processed comment:', processedComment);
    
    // Map document IDs to actual filenames
    const filenameMap = {
      'pattern-recognition-identity': 'sample.md',
      'empirical-evidence': 'sample.md',
      'related-work': 'sample.md'
    };
    
    // Use mapped filename or fallback to requested filename
    const actualFilename = filenameMap[docId] || filename;
    
    // Build the GitHub API URL
    const filePath = `content/${actualFilename}`;
    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filePath}`;
    
    console.log('Fetching from GitHub:', apiUrl);
    
    // Get current file from GitHub
    const getResponse = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare-Worker'
      }
    });
    
    if (!getResponse.ok) {
      // Clone response before reading to avoid "body already used" error
      const responseClone = getResponse.clone();
      const errorText = await responseClone.text();
      console.error('GitHub fetch error:', getResponse.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: `File not found: ${actualFilename}`,
        details: `Tried to access: ${apiUrl}`,
        suggestion: 'Please check your filename mappings'
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
    let content = atob(fileData.content.replace(/\n/g, ''));
    
    // Append the comment at the end
    content = content + '\n' + processedComment + '\n';
    
    // Commit back to GitHub
    const updateResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker'
      },
      body: JSON.stringify({
        message: `Add comment to ${actualFilename}`,
        content: btoa(content),
        sha: fileData.sha,
        committer: {
          name: 'Research Comments',
          email: 'comments@research.project'
        }
      })
    });
    
    if (!updateResponse.ok) {
      // Clone response before reading to avoid "body already used" error
      const responseClone = updateResponse.clone();
      const errorText = await responseClone.text();
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
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `Comment added to ${actualFilename}`,
      mappedFrom: filename,
      mappedTo: actualFilename
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