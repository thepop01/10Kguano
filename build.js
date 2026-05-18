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
