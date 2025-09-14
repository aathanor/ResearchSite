export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const { filename, paraIndex, comment, docId } = await request.json();
    
    // Get current file from GitHub
    const getUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${filename}`;
    
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    
    if (!getResponse.ok) {
      throw new Error(`Failed to fetch file: ${getResponse.status}`);
    }
    
    const fileData = await getResponse.json();
    let content = atob(fileData.content);
    
    // Parse the markdown to find where to insert comment
    const lines = content.split('\n');
    let currentPara = -1;
    let insertIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Count paragraphs (non-empty, non-header lines)
      if (line && !line.startsWith('#') && !line.startsWith('---')) {
        currentPara++;
        if (currentPara == paraIndex) {
          insertIndex = i + 1; // Insert after this line
          break;
        }
      }
    }
    
    // Insert the comment
    if (insertIndex > -1) {
      lines.splice(insertIndex, 0, comment);
    } else {
      // If we can't find the exact position, append at end
      lines.push(comment);
    }
    
    const newContent = lines.join('\n');
    
    // Commit back to GitHub
    const updateUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${filename}`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add comment to ${filename}`,
        content: btoa(newContent),
        sha: fileData.sha,
        committer: {
          name: 'Research Comments',
          email: 'comments@research.project'
        }
      })
    });
    
    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      throw new Error(`Failed to update file: ${error}`);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error saving comment:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle CORS preflight
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