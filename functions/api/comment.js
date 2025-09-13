// functions/api/comment.js
// Handles adding comments to markdown files via GitHub API

export async function onRequest(context) {
  const { request, env } = context;
  
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  
  try {
    const { file, position, type, lineNumber } = await request.json();
    
    // Validate comment type
    if (!['?', '!', '✓'].includes(type)) {
      return new Response('Invalid comment type', { status: 400 });
    }
    
    // Get current file content from GitHub
    const getResponse = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${file}`,
      {
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        }
      }
    );
    
    if (!getResponse.ok) {
      throw new Error('Failed to fetch file from GitHub');
    }
    
    const fileData = await getResponse.json();
    const content = atob(fileData.content);
    
    // Insert comment at the specified position
    const lines = content.split('\n');
    const commentTag = `<!-- ${type} -->`;
    
    // Insert comment at end of specified line
    if (lineNumber < lines.length) {
      lines[lineNumber] = lines[lineNumber] + ' ' + commentTag;
    }
    
    const newContent = lines.join('\n');
    
    // Commit the change back to GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/content/${file}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add ${type} comment to ${file}`,
          content: btoa(newContent),
          sha: fileData.sha,
          committer: {
            name: 'Research Supervisor',
            email: 'supervisor@research.project'
          }
        })
      }
    );
    
    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      throw new Error(`Failed to update file: ${error}`);
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error adding comment:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}