// functions/api/list-documents.js
export async function onRequestGet(context) {
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
      const base64Content = fileData.content.replace(/\n/g, '');
      const binaryString = atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const content = new TextDecoder('utf-8').decode(bytes);
      
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