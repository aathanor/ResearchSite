export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Check if environment variables exist
    if (!env.GITHUB_TOKEN) {
      return new Response(JSON.stringify({ 
        error: 'Missing GITHUB_TOKEN environment variable',
        details: 'Please set up a GitHub personal access token with repo permissions'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    if (!env.GITHUB_OWNER || !env.GITHUB_REPO) {
      return new Response(JSON.stringify({ 
        error: 'Missing repository configuration',
        details: 'Please set GITHUB_OWNER and GITHUB_REPO environment variables'
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body));
    
    const { filename, paraIndex, comment, docId } = body;
    
    if (!filename) {
      return new Response(JSON.stringify({ 
        error: 'Missing filename parameter' 
      }), {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Build the GitHub API URL - ensure correct path
    const filePath = `content/${filename}`;
    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filePath}`;
    
    console.log('Fetching from GitHub:', apiUrl);
    
    // First, verify the token has access to the repo
    const repoUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}`;
    const repoResponse = await fetch(repoUrl, {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Cloudflare-Worker'
      }
    });
    
    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      console.error('GitHub repo access error:', repoResponse.status, errorText);
      
      let errorMsg = `Cannot access repository: ${repoResponse.status}`;
      if (repoResponse.status === 403) {
        errorMsg = 'GitHub token does not have access to this repository. Please check token permissions.';
      } else if (repoResponse.status === 404) {
        errorMsg = 'Repository not found. Please check GITHUB_OWNER and GITHUB_REPO values.';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMsg,
        details: errorText
      }), {
        status: repoResponse.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
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
      console.error('GitHub file fetch error:', getResponse.status, errorText);
      
      let errorMsg = `Cannot access file: ${getResponse.status}`;
      if (getResponse.status === 404) {
        errorMsg = `File not found: ${filePath}. Please check the filename.`;
      } else if (getResponse.status === 403) {
        errorMsg = 'GitHub token does not have permission to access this file.';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMsg,
        details: errorText
      }), {
        status: getResponse.status,
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
        message: `Add comment to ${filename}`,
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
      message: 'Comment added successfully'
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
        error: 'Internal server error',
        details: error.message 
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