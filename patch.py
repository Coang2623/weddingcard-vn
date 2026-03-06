import re

with open('src/app/[slug]/ClientInvitation.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add isVip alongside isCinematic and isModern
text = re.sub(
    r"const isCinematic = theme\.style === 'cinematic'",
    "const isCinematic = theme.style === 'cinematic'\n    const isVip = theme.style === 'vip'",
    text
)
text = re.sub(
    r"const isDark = theme\.style === 'cinematic' \|\| theme\.style === 'modern'",
    "const isDark = theme.style === 'cinematic' || theme.style === 'modern' || theme.style === 'vip'",
    text
)
text = re.sub(
    r"const isDarkTheme = theme\.style === 'cinematic' \|\| theme\.style === 'modern'",
    "const isDarkTheme = theme.style === 'cinematic' || theme.style === 'modern' || theme.style === 'vip'",
    text
)
text = re.sub(
    r"const isDark = isCinematic \|\| isModern",
    "const isDark = isCinematic || isModern || isVip",
    text
)
text = re.sub(
    r"isCinematic \|\| isModern",
    "isCinematic || isModern || isVip",
    text
)

# Handle HeroBlock specific styling
text = re.sub(
    r"background: isCinematic\s+\?\s+`linear-gradient\(to bottom, #050505, #1a1a1a\)`",
    "background: isVip ? `linear-gradient(to bottom, #020617, #0f172a)` : isCinematic ? `linear-gradient(to bottom, #050505, #1a1a1a)`",
    text,
    count=1
)

text = re.sub(
    r"\(isCinematic \|\| isModern \|\| isVip\) \? '([^']+)' : isTraditional \? '([^']+)' : '([^']+)'",
    "isVip ? '👑' : isCinematic ? '\\1' : isTraditional ? '\\2' : isModern ? '\\3' : '✨'",
    text
)

text = re.sub(
    r"\(isCinematic \|\| isModern \|\| isVip\) && <FloatingParticles />",
    "((isCinematic || isModern || isVip) && theme.style !== 'vip') && <FloatingParticles />",
    text
)

# Text Block
text = re.sub(
    r"const bg = isDark \? \(\s*isCinematic \? '#1c1c1c' : '#23233b'\s*\)",
    "const bg = isDark ? (isVip ? '#020617' : isCinematic ? '#1c1c1c' : '#23233b')",
    text
)

# Gallery Block
text = re.sub(
    r"const bg = isDark \? \(\s*theme\.style === 'cinematic' \? '#141414' : '#1a1a2e'\s*\)",
    "const bg = isDark ? (theme.style === 'vip' ? '#0f172a' : theme.style === 'cinematic' ? '#141414' : '#1a1a2e')",
    text
)

# Countdown Block
text = re.sub(
    r"\(\s*theme\.style === 'cinematic' \? '#0d0d0d' : '#14142b'\s*\)",
    "(theme.style === 'vip' ? '#020617' : theme.style === 'cinematic' ? '#0d0d0d' : '#14142b')",
    text
)

# Story Block
text = re.sub(
    r"theme\.style === 'cinematic' \? '#111' : '#1a1a2e'",
    "theme.style === 'vip' ? '#0f172a' : theme.style === 'cinematic' ? '#111' : '#1a1a2e'",
    text
)

# RSVP Block
text = re.sub(
    r"const bg = isDarkTheme \? \(\s*theme\.style === 'cinematic' \? '#1a1a1a' : '#111827'\s*\)",
    "const bg = isDarkTheme ? (theme.style === 'vip' ? '#020617' : theme.style === 'cinematic' ? '#1a1a1a' : '#111827')",
    text
)

with open('src/app/[slug]/ClientInvitation.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
