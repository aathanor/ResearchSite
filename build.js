// build.js - Processes all markdown files into a single JSON index
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

function processMarkdownFiles(dir) {
  const documents = {};
  const tree = {};
  
  // Recursively read all .md files
  function readDir(currentPath, relativePath = '') {
    const files = fs.readdirSync(currentPath);
    
    files.forEach(file => {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        readDir(fullPath, path.join(relativePath, file));
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const parsed = matter(content);
        const id = relativePath + '/' + file;
        
        // Extract comments with positions
        const comments = [];
        const commentRegex = /<!-- ([?!✓]) (.*?) -->/g;
        let match;
        while ((match = commentRegex.exec(parsed.content)) !== null) {
          comments.push({
            type: match[1],
            text: match[2],
            position: match.index
          });
        }
        
        documents[id] = {
          id,
          title: parsed.data.title || file,
          content: parsed.content,
          html: marked.parse(parsed.content),
          frontmatter: parsed.data,
          lens: parsed.data.lens || [],
          node: parsed.data.node || 'uncategorized',
          parent: parsed.data.parent || null,
          status: parsed.data.status || 'draft',
          related: parsed.data.related || [],
          comments: comments,
          lastModified: stat.mtime
        };
        
        // Build tree structure
        const node = parsed.data.node;
        if (node) {
          if (!tree[node]) {
            tree[node] = {
              id: node,
              parent: parsed.data.parent,
              documents: [],
              children: []
            };
          }
          tree[node].documents.push(id);
        }
      }
    });
  }
  
  readDir(dir);
  
  // Link parent-child relationships in tree
  Object.values(tree).forEach(node => {
    if (node.parent && tree[node.parent]) {
      tree[node.parent].children.push(node.id);
    }
  });
  
  return { documents, tree };
}

// Process files and output JSON
const contentDir = path.join(__dirname, 'content');
const outputDir = path.join(__dirname, 'site', 'data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const result = processMarkdownFiles(contentDir);

fs.writeFileSync(
  path.join(outputDir, 'documents.json'),
  JSON.stringify(result, null, 2)
);

console.log(`Processed ${Object.keys(result.documents).length} documents`);
console.log(`Created ${Object.keys(result.tree).length} tree nodes`);