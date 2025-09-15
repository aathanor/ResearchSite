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
    
    const { docId, paraIndex, comment: originalComment } = body;
    
    // Get JWT from headers
    const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
    let author = 'anonymous';
    
    // Fetch identity if JWT is present
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
    
    // Get list of files in content directory from GitHub
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
    console.log('Content files:', contentData.map(file => file.name));
    
    // Find the file that matches our document
    // We'll look for a file that might be related to the docId
    let actualFilename = null;
    
    // First, try exact match
    const exactMatch = contentData.find(file => file.name === `${docId}.md`);
    if (exactMatch) {
      actualFilename = exactMatch.name;
    } else {
      // If no exact match, try to find the first .md file
      const mdFiles = contentData.filter(file => file.name.endsWith('.md'));
      if (mdFiles.length > 0) {
        actualFilename = mdFiles[0].name; // Use the first .md file found
        console.log(`Using first .md file found: ${actualFilename}`);
      }
    }
    
    if (!actualFilename) {
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
    
    console.log('Using file:', actualFilename);
    
    // Build the GitHub API URL for the specific file
    const fileUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${actualFilename}`;
    console.log('Fetching file from GitHub:', fileUrl);
    
    // Get current file from GitHub
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
    console.log('File fetched successfully');
    
    // Decode the content
    let content = atob(fileData.content.replace(/\n/g, ''));
    
    // Append the comment at the end
    content = content + '\n' + processedComment + '\n';
    
    // Commit back to GitHub
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
        content: btoa(content),
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
    
    return new Response(JSON.stringify({ 
      success: true,
      message: `Comment added to ${actualFilename}`,
      filename: actualFilename
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