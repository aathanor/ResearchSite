export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    console.log('Function invoked'); // Always log entry for debugging
    
    // Check if environment variables exist
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      throw new Error('Missing environment variables');
    }
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { filename, paraIndex, docId } = body;
    let comment = body.comment;
    
    const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
    console.log('JWT present:', !!jwt);
    
    let author = 'anonymous'; // Fallback
    
    if (jwt) {
      const identityUrl = 'https://aathanor.cloudflareaccess.com/cdn-cgi/access/get-identity'; // Confirm this is your correct team name from Zero Trust dashboard
      console.log('Fetching identity from:', identityUrl);
      const identityResponse = await fetch(identityUrl, {
        headers: { 'Cf-Access-Jwt-Assertion': jwt }
      });
      console.log('Identity response status:', identityResponse.status);
      
      if (identityResponse.ok) {
        const identity = await identityResponse.json();
        console.log('Identity data:', JSON.stringify(identity));
        author = identity.email || author;
      } else {
        console.error('Identity fetch failed:', identityResponse.status, await identityResponse.text());
      }
    }
    
    console.log('Final author:', author);
    
    // Parse and replace author in comment (handles |-separated format)
    const commentParts = comment.split('|').map(part => part.trim());
    if (commentParts.length >= 3 && commentParts[1] === 'anonymous') {
      commentParts[1] = author;
    }
    comment = commentParts.join(' | ');
    
    // Ensure comment is wrapped as Markdown/HTML comment if not already
    if (!comment.startsWith('<!--')) {
      comment = `<!-- ? [${comment}] -->`;
    }
    
    // Map document IDs to actual filenames (temporary; consider dynamic listing for auto-derivation)
    const filenameMap = {
      'pattern-recognition-identity': 'sample.md',
      'empirical-evidence': 'sample.md',
      'related-work': 'sample.md'
    };
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
      console.error('GitHub GET failed:', getResponse.status, errorText);
      throw new Error(`GitHub GET error: ${getResponse.status} - ${errorText}`);
    }
    
    const fileData = await getResponse.json();
    console.log('File fetched successfully');
    
    // Decode the content
    let content = atob(fileData.content.replace(/\n/g, ''));
    
    // Split into paragraphs for targeted insertion (using 2+ newlines as separator)
    const paragraphs = content.split(/\n{2,}/);
    if (paraIndex < 0 || paraIndex >= paragraphs.length) {
      throw new Error('Comment target paragraph not found');
    }
    
    // Insert comment at the end of the target paragraph
    paragraphs[paraIndex] += '\n' + comment;
    
    // Rejoin content
    content = paragraphs.join('\n\n');
    
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
      console.error('GitHub PUT failed:', updateResponse.status, errorText);
      throw new Error(`GitHub PUT error: ${updateResponse.status} - ${errorText}`);
    }
    
    console.log('Save successful for file:', actualFilename);
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Function error:', error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}