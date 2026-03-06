const fs = require('fs');

let text = fs.readFileSync('src/app/[slug]/ClientInvitation.tsx', 'utf-8');

text = text.replace(
    /\(isCinematic \|\| isModern\)/g,
    "(isCinematic || isModern || isVip)"
);

// Update some other missing links:

// MapBlock - ensure isDark checks 'vip'
text = text.replace(
    /const isDarkTheme = theme\.style === 'cinematic' \|\| theme\.style === 'modern'/g,
    "const isDarkTheme = theme.style === 'cinematic' || theme.style === 'modern' || theme.style === 'vip'"
);

// Add google fonts import if not there
if (!text.includes('Outfit')) {
    console.log("no Outfit");
}

fs.writeFileSync('src/app/[slug]/ClientInvitation.tsx', text, 'utf-8');
console.log('Script completed');
