import { DEFAULT_TEMPLATES } from './src/lib/templates';
import * as fs from 'fs';

fs.writeFileSync('templates.json', JSON.stringify(DEFAULT_TEMPLATES, null, 2));
console.log('Saved to templates.json');
