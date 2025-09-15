export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Check if environment variables exist
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      throw new Error('Missing environment variables');
    }
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { filename, paraIndex, docId } = body;
    let comment = body.comment;

    const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
    let author = 'anonymous';
    if (jwt) {
      const identityUrl = 'https://aathanor.cloudflareaccess.com/cdn-cgi/access/get-identity'; // Replace <your-team-name> with actual (e.g., florin-research)
      console.log('Fetching identity from:', identityUrl);
      const identityResponse = await fetch(identityUrl, {
        headers: { 'Cf-Access-Jwt-Assertion': jwt }
      });
      console.log('Identity response status:', identityResponse.status);

      if (identityResponse.ok) {
        const identity = await identityResponse.json();
        console.log('Identity data:', JSON.stringify(identity)); // Redacts sensitive but shows keys
        author = identity.email || author;
      } else {
        console.error('Identity fetch failed:', identityResponse.status, await identityResponse.text());
      }
    }
    console.log('Final author:', author);

    // Parse, replace author, and rebuild (reassign to comment for no downstream changes)
    const commentParts = comment.split('|').map(part => part.trim());
    if (commentParts.length >= 3 && commentParts[1] === 'anonymous') {
    commentParts[1] = author;
    }
    comment = commentParts.join(' | ');

    console.log('Checking JWT header:', request.headers.get('Cf-Access-Jwt-Assertion') ? 'Present (redacted)' : 'Missing');
    
    if (jwt) {
    const identityUrl = 'https://aathanor.cloudflareaccess.com/cdn-cgi/access/get-identity'; // Or `https://${env.ACCESS_DOMAIN}/cdn-cgi/access/get-identity`
    const identityResponse = await fetch(identityUrl, {
        headers: {
        'Cf-Access-Jwt-Assertion': jwt
        }
    });

    console.log('Identity response status:', identityResponse.status);
    if (identityResponse.ok) {
        const identity = await identityResponse.json();
        console.log('Identity data:', identity); // Check for 'email' key
    } else {
        console.error('Failed to fetch identity:', await identityResponse.text());
    }
    if (identityResponse.ok) {
        const identity = await identityResponse.json();
        author = identity.email || author; // Use email; alternatively identity.name if available/preferred
    } else {
        console.error('Failed to fetch identity:', await identityResponse.text());
        }
    }

    // Modify comment to use the real author
    const updatedComment = comment.replace('anonymous', author);

    // Map document IDs to actual filenames
    const filenameMap = {
      'pattern-recognition-identity': 'sample.md',
      'empirical-evidence': 'sample.md', // Add other mappings as needed
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
      const errorText = await getResponse.text();
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
    
    // For now, just append the comment at the end to test
    content = content + '\n' + comment + '\n';
    
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
      const errorText = await updateResponse.text();
      console.error('GitHub update error:', errorText);
      throw new Error(`Failed to update file: ${errorText}`);
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