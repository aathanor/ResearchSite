// functions/api/list-documents.js
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

  const { env } = context;
  
  try {
    if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
      throw new Error('Missing environment variables');
    }
    
    console.log('Fetching all markdown files from GitHub...');
    
    // Recursive function to get all .md files
    async function getAllMdFiles(path = 'content') {
      const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Cloudflare-Worker'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${path}: ${response.status}`);
      }
      
      const data = await response.json();
      let files = [];
      
      for (const item of data) {
        if (item.type === 'file' && item.name.endsWith('.md')) {
          files.push(item);
        } else if (item.type === 'dir') {
          const subfiles = await getAllMdFiles(item.path);
          files.push(...subfiles);
        }
      }
      
      return files;
    }
    
    const mdFiles = await getAllMdFiles();
    console.log(`Found ${mdFiles.length} markdown files`);
    
    const documents = {};
    const tree = {};
    
    await Promise.all(mdFiles.map(async (file) => {
      const fileUrl = file.download_url; // Or use API url: `https://api.github.com/repos/.../contents/${file.path}`
      const getResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${file.path}`, {
        headers: {
          'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Cloudflare-Worker'
        }
      });
      
      if (!getResponse.ok) {
        console.error(`Failed to fetch ${file.name}`);
        return;
      }
      
      const fileData = await getResponse.json();
      
      // Decode content with UTF-8 handling
      const content = decodeGitHubContent(fileData.content);
      
      // Extract id (relative path including .md)
      const id = file.path.replace(/^content\//, '');
      
      // Frontmatter extraction (copied from build.js)
      let title = file.name.replace('.md', '');
      let frontmatter = {};
      let bodyContent = content;
      
      if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3);
        if (endIndex > 0) {
          const yamlContent = content.substring(3, endIndex);
          bodyContent = content.substring(endIndex + 3).trim();
          
          // Basic YAML parsing
          yamlContent.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
              const key = line.substring(0, colonIndex).trim();
              let value = line.substring(colonIndex + 1).trim();
              
              if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
              } else {
                value = value.replace(/['"]/g, '');
              }
              
              frontmatter[key] = value;
            }
          });
          title = frontmatter.title || title;
        }
      }
      
      // Extract comments from body
      const comments = [];
      const commentRegex = /<!-- ([?!âœ"]) -->/g;
      let match;
      while ((match = commentRegex.exec(bodyContent)) !== null) {
        comments.push({
          type: match[1],
          position: match.index
        });
      }
      
      documents[id] = {
        id,
        title,
        content: bodyContent.substring(0, 500),
        fullContent: bodyContent,
        frontmatter,
        lens: frontmatter.lens || [],
        tags: frontmatter.tags || [],  // ADDED: Extract tags field
        node: frontmatter.node || 'uncategorized',
        parent: frontmatter.parent || null,
        status: frontmatter.status || 'draft',
        related: frontmatter.related || [],
        comments,
        // Note: Skipping lastModified as GitHub contents API doesn't provide mtime directly
      };
      
      // Build tree
      const node = frontmatter.node || 'uncategorized';
      if (!tree[node]) {
        tree[node] = {
          id: node,
          parent: frontmatter.parent,
          documents: [],
          children: []
        };
      }
      tree[node].documents.push(id);
    }));
    
    // Link parent-child in tree
    Object.values(tree).forEach(node => {
      if (node.parent && tree[node.parent]) {
        tree[node.parent].children.push(node.id);
      }
    });
    
    return new Response(JSON.stringify({ documents, tree }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('List documents error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// CORS OPTIONS
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}