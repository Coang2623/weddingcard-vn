const fs = require('fs');

let text = fs.readFileSync('src/app/[slug]/ClientInvitation.tsx', 'utf-8');

// Add isVip alongside isCinematic and isModern
text = text.replace(
    /const isCinematic = theme\.style === 'cinematic'/g,
    "const isCinematic = theme.style === 'cinematic'\n    const isVip = theme.style === 'vip'"
);
text = text.replace(
    /const isDark = theme\.style === 'cinematic' \|\| theme\.style === 'modern'/g,
    "const isDark = theme.style === 'cinematic' || theme.style === 'modern' || theme.style === 'vip'"
);
text = text.replace(
    /const isDarkTheme = theme\.style === 'cinematic' \|\| theme\.style === 'modern'/g,
    "const isDarkTheme = theme.style === 'cinematic' || theme.style === 'modern' || theme.style === 'vip'"
);
text = text.replace(
    /const isDark = isCinematic \|\| isModern/g,
    "const isDark = isCinematic || isModern || isVip"
);

// HeroBlock
text = text.replace(
    /background: isCinematic\s*\n?\s*\?\s*`linear-gradient\(to bottom, #050505, #1a1a1a\)`/g,
    "background: isVip ? `linear-gradient(to bottom, #020617, #0f172a)` : isCinematic ? `linear-gradient(to bottom, #050505, #1a1a1a)`"
);

// Update emoji condition in HeroBlock (if existing)
text = text.replace(
    /\(isCinematic \|\| isModern\) \? '([^']+)' : isTraditional \? '([^']+)' : '([^']+)'/g,
    "isVip ? '🎀' : isCinematic ? '$1' : isTraditional ? '$2' : isModern ? '$3' : '✨'"
);

// FloatingParticles condition
text = text.replace(
    /\(isCinematic \|\| isModern\) && <FloatingParticles \/>/g,
    "(isCinematic || isModern || isVip) && <FloatingParticles />"
);

// Text Block
text = text.replace(
    /const bg = isDark \? \(isCinematic \? '#1c1c1c' : '#23233b'\) : '#ffffff'/g,
    "const bg = isDark ? (isVip ? '#020617' : isCinematic ? '#1c1c1c' : '#23233b') : '#ffffff'"
);

// Gallery Block
text = text.replace(
    /const bg = isDark \? \(theme\.style === 'cinematic' \? '#141414' : '#1a1a2e'\) : 'white'/g,
    "const bg = isDark ? (theme.style === 'vip' ? '#0f172a' : theme.style === 'cinematic' ? '#141414' : '#1a1a2e') : 'white'"
);

// Countdown Block
text = text.replace(
    /\(theme\.style === 'cinematic' \? '#0d0d0d' : '#14142b'\)/g,
    "(theme.style === 'vip' ? '#020617' : theme.style === 'cinematic' ? '#0d0d0d' : '#14142b')"
);

// Story Block
text = text.replace(
    /theme\.style === 'cinematic' \? '#111' : '#1a1a2e'/g,
    "theme.style === 'vip' ? '#0f172a' : theme.style === 'cinematic' ? '#111' : '#1a1a2e'"
);

// RSVP Block
text = text.replace(
    /const bg = isDarkTheme \? \(theme\.style === 'cinematic' \? '#1a1a1a' : '#111827'\) : '#ffffff'/g,
    "const bg = isDarkTheme ? (theme.style === 'vip' ? '#020617' : theme.style === 'cinematic' ? '#1a1a1a' : '#111827') : '#ffffff'"
);

fs.writeFileSync('src/app/[slug]/ClientInvitation.tsx', text, 'utf-8');
console.log('Script completed');
