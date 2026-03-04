const fs = require('fs');

const templates = JSON.parse(fs.readFileSync('templates.json', 'utf8'));

let sql = `INSERT INTO templates (id, name, style, preview_image, is_premium, default_theme, default_blocks) VALUES\n`;

const values = templates.map(t => {
    return `(
    '${t.id}', 
    '${t.name}', 
    '${t.style}', 
    '${t.preview_image}', 
    ${t.is_premium}, 
    '${JSON.stringify(t.default_theme).replace(/'/g, "''")}'::jsonb, 
    '${JSON.stringify(t.default_blocks).replace(/'/g, "''")}'::jsonb
  )`;
});

sql += values.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  style = EXCLUDED.style,
  preview_image = EXCLUDED.preview_image,
  is_premium = EXCLUDED.is_premium,
  default_theme = EXCLUDED.default_theme,
  default_blocks = EXCLUDED.default_blocks;`;

fs.writeFileSync('seed_templates.sql', sql);
console.log('SQL generated!');
