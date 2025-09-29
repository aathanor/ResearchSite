export async function onRequestGet(context) {

  // COMPLETELY SAFE VERSION - Use this in ALL files:

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
    
    // Get filename from URL params
    const url = new URL(request.url);
    const filename = url.searchParams.get('filename');
    
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
    
    console.log('Fetching content for:', filename);
    
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
    
    // Find the specific file or use the first one that matches
    let actualFilename = mdFiles.find(file => file.name === filename)?.name;
    if (!actualFilename) {
      // Try without .md extension
      actualFilename = mdFiles.find(file => file.name === filename + '.md')?.name;
    }
    if (!actualFilename) {
      // Use first file as fallback
      actualFilename = mdFiles[0].name;
    }
    
    console.log('Using file:', actualFilename);

    // Fetch the file content
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
    const content = decodeGitHubContent(fileData.content);
    
    return new Response(JSON.stringify({ 
      success: true,
      content: content,
      filename: actualFilename,
      sha: fileData.sha
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Get content error:', error.message);
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