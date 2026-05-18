const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_KEY environment variables are missing!');
}

const content = `export const SUPABASE_URL = '${url || ''}';
export const SUPABASE_KEY = '${key || ''}';
`;

const configPath = path.join(__dirname, 'js', 'config.js');

// Ensure js directory exists
if (!fs.existsSync(path.dirname(configPath))) {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
}

fs.writeFileSync(configPath, content);
console.log('Successfully generated js/config.js from environment variables.');

// Vercel expects a build output directory. We will copy static files to "public"
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const itemsToCopy = ['index.html', 'js', 'styles', 'assets'];

itemsToCopy.forEach(item => {
  const src = path.join(__dirname, item);
  const dest = path.join(publicDir, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
});

console.log('Successfully copied files to public directory.');
