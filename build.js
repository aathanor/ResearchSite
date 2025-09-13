// build.js - Fixed version with proper variable scoping
const fs = require('fs');
const path = require('path');

// Simple build without dependencies first
function processMarkdownFiles(dir) {
  const documents = {};
  const tree = {};
  
  if (!fs.existsSync(dir)) {
    console.log(`Creating content directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
  
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
        const id = (relativePath ? relativePath + '/' : '') + file;
        
        // Simple frontmatter extraction (without gray-matter for now)
        let title = file.replace('.md', '');
        let frontmatter = {};
        let bodyContent = content; // Initialize with full content by default
        
        if (content.startsWith('---')) {
          const endIndex = content.indexOf('---', 3);
          if (endIndex > 0) {
            const yamlContent = content.substring(3, endIndex);
            // Extract body content (everything after frontmatter)
            bodyContent = content.substring(endIndex + 3).trim();
            
            // Basic YAML parsing
            yamlContent.split('\n').forEach(line => {
              const colonIndex = line.indexOf(':');
              if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Handle arrays (basic)
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
        
        // Extract comments from body content (not full content with YAML)
        const comments = [];
        const commentRegex = /<!-- ([?!✓]) -->/g;
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
          content: bodyContent.substring(0, 500), // First 500 chars of body for preview
          fullContent: bodyContent, // Full body content without frontmatter
          frontmatter,
          lens: frontmatter.lens || [],
          node: frontmatter.node || 'uncategorized',
          parent: frontmatter.parent || null,
          status: frontmatter.status || 'draft',
          related: frontmatter.related || [],
          comments,
          lastModified: stat.mtime
        };
        
        // Build tree structure
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
      }
    });
  }
  
  try {
    readDir(dir);
  } catch (error) {
    console.error('Error reading directory:', error);
  }
  
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

console.log('Content directory:', contentDir);
console.log('Output directory:', outputDir);

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  console.log('Creating output directory...');
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process markdown files
console.log('Processing markdown files...');
const result = processMarkdownFiles(contentDir);

// Write JSON file
const outputPath = path.join(outputDir, 'documents.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log(`✓ Processed ${Object.keys(result.documents).length} documents`);
console.log(`✓ Created ${Object.keys(result.tree).length} tree nodes`);
console.log(`✓ Output written to ${outputPath}`);