/**
 * High-fidelity, delightful storybook vector illustrations for our 4 seed books.
 * Designed with warm pastels, gold foil textures, star constellations, and fairytale motifs.
 */

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const bookCovers = {
  fallingStar: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1B1E3F"/>
      <stop offset="45%" stop-color="#2D3A68"/>
      <stop offset="85%" stop-color="#4B588A"/>
      <stop offset="100%" stop-color="#7B88B2"/>
    </linearGradient>
    <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFF9D2" stop-opacity="1"/>
      <stop offset="40%" stop-color="#FCD34D" stop-opacity="0.8"/>
      <stop offset="80%" stop-color="#F59E0B" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="moonGlow" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="70%" stop-color="#FEF08A"/>
      <stop offset="100%" stop-color="#FDE047"/>
    </radialGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background Cover -->
  <rect width="600" height="800" fill="url(#nightSky)"/>

  <!-- Ornate Decorative Storybook Border -->
  <rect x="24" y="24" width="552" height="752" rx="16" fill="none" stroke="#FDE047" stroke-width="2.5" stroke-opacity="0.6"/>
  <rect x="32" y="32" width="536" height="736" rx="12" fill="none" stroke="#FFF" stroke-width="1" stroke-opacity="0.25"/>

  <!-- Corner Stars -->
  <g fill="#FDE047" opacity="0.85">
    <path d="M 45 45 L 49 35 L 53 45 L 63 49 L 53 53 L 49 63 L 45 53 L 35 49 Z"/>
    <path d="M 555 45 L 559 35 L 563 45 L 573 49 L 563 53 L 559 63 L 555 53 L 545 49 Z"/>
    <path d="M 45 755 L 49 745 L 53 755 L 63 759 L 53 763 L 49 773 L 45 763 L 35 759 Z"/>
    <path d="M 555 755 L 559 745 L 563 755 L 573 759 L 563 763 L 559 773 L 555 763 L 545 759 Z"/>
  </g>

  <!-- Constellations & Twinkles -->
  <circle cx="120" cy="160" r="2.5" fill="#FFF" opacity="0.8"/>
  <circle cx="160" cy="140" r="2" fill="#FFF" opacity="0.6"/>
  <circle cx="210" cy="170" r="3" fill="#FFF" opacity="0.9"/>
  <line x1="120" y1="160" x2="160" y2="140" stroke="#FFF" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.4"/>
  <line x1="160" y1="140" x2="210" y2="170" stroke="#FFF" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.4"/>

  <!-- Smiling Crescent Moon -->
  <g transform="translate(430, 110)">
    <circle cx="50" cy="50" r="55" fill="url(#starGlow)" opacity="0.5"/>
    <path d="M 50 10 A 40 40 0 1 0 85 70 A 35 35 0 1 1 50 10 Z" fill="url(#moonGlow)"/>
    <!-- Sleepy eye on moon -->
    <path d="M 42 42 Q 47 48 52 42" fill="none" stroke="#854D0E" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="56" cy="48" r="4" fill="#F43F5E" opacity="0.4"/>
  </g>

  <!-- Soft Rolling Clouds & Hills -->
  <path d="M 0 540 Q 150 490 300 530 T 600 500 L 600 800 L 0 800 Z" fill="#243054" opacity="0.7"/>
  <path d="M 0 600 Q 200 550 400 590 T 600 570 L 600 800 L 0 800 Z" fill="#1B223C"/>

  <!-- Magical Star Fall Trail -->
  <path d="M 500 180 Q 380 260 300 390" fill="none" stroke="url(#starGlow)" stroke-width="8" stroke-linecap="round" opacity="0.7"/>
  <path d="M 490 190 Q 390 270 300 390" fill="none" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="6,8"/>

  <!-- Central Star in boy's hands -->
  <circle cx="300" cy="390" r="60" fill="url(#starGlow)"/>
  <path d="M 300 345 L 312 375 L 345 385 L 320 405 L 328 435 L 300 418 L 272 435 L 280 405 L 255 385 L 288 375 Z" fill="#FEF08A" filter="url(#softShadow)"/>
  <circle cx="295" cy="385" r="3" fill="#854D0E"/>
  <circle cx="305" cy="385" r="3" fill="#854D0E"/>
  <path d="M 297 392 Q 300 396 303 392" fill="none" stroke="#854D0E" stroke-width="2"/>

  <!-- Little Boy Illustration -->
  <g transform="translate(230, 420)">
    <!-- Pajamas Body -->
    <path d="M 50 80 Q 70 65 90 80 L 105 180 Q 70 190 35 180 Z" fill="#60A5FA"/>
    <!-- Pajama Stars -->
    <circle cx="60" cy="110" r="3" fill="#FFF" opacity="0.6"/>
    <circle cx="80" cy="140" r="3" fill="#FFF" opacity="0.6"/>
    <circle cx="55" cy="155" r="3" fill="#FFF" opacity="0.6"/>
    <!-- Head -->
    <circle cx="70" cy="45" r="32" fill="#FED7AA"/>
    <!-- Messy brown hair -->
    <path d="M 38 45 C 38 18 102 18 102 45 C 95 30 75 30 70 36 C 65 30 45 30 38 45 Z" fill="#78350F"/>
    <!-- Cute face -->
    <circle cx="62" cy="48" r="3" fill="#451A03"/>
    <circle cx="78" cy="48" r="3" fill="#451A03"/>
    <path d="M 66 57 Q 70 62 74 57" fill="none" stroke="#B45309" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="56" cy="55" r="5" fill="#FDA4AF" opacity="0.6"/>
    <circle cx="84" cy="55" r="5" fill="#FDA4AF" opacity="0.6"/>
  </g>

  <!-- Title & Typography Banner -->
  <rect x="50" y="650" width="500" height="95" rx="14" fill="#0F172A" fill-opacity="0.85" stroke="#FDE047" stroke-width="1.5"/>
  <text x="300" y="688" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="28" fill="#FFFBEB" letter-spacing="0.5">THE BOY WHO CAUGHT</text>
  <text x="300" y="722" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="32" fill="#FDE047" letter-spacing="1">A FALLING STAR</text>
  <text x="300" y="635" text-anchor="middle" font-family="'Nunito', sans-serif" font-weight="600" font-size="14" fill="#E2E8F0" letter-spacing="3">WRITTEN BY ELENA WOODS</text>
</svg>
`),

  secretForest: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#064E3B"/>
      <stop offset="50%" stop-color="#065F46"/>
      <stop offset="100%" stop-color="#022C22"/>
    </linearGradient>
    <radialGradient id="mintGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#A7F3D0" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#34D399" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#059669" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="600" height="800" fill="url(#forestSky)"/>
  <!-- Border -->
  <rect x="24" y="24" width="552" height="752" rx="16" fill="none" stroke="#6EE7B7" stroke-width="2.5" stroke-opacity="0.6"/>
  <rect x="32" y="32" width="536" height="736" rx="12" fill="none" stroke="#FFF" stroke-width="1" stroke-opacity="0.2"/>

  <!-- Ancient Oak Tree Trunk & Branches -->
  <path d="M 0 350 Q 180 320 280 420 Q 380 340 600 370 L 600 800 L 0 800 Z" fill="#1C1917" opacity="0.95"/>
  <path d="M 50 480 Q 220 400 350 480 Q 480 390 580 430" fill="none" stroke="#44403C" stroke-width="36" stroke-linecap="round"/>
  <path d="M 120 460 Q 200 370 260 410" fill="none" stroke="#292524" stroke-width="22" stroke-linecap="round"/>

  <!-- Soft Foliage Canopy -->
  <circle cx="100" cy="180" r="140" fill="#047857" opacity="0.6"/>
  <circle cx="280" cy="120" r="160" fill="#059669" opacity="0.5"/>
  <circle cx="480" cy="160" r="150" fill="#10B981" opacity="0.4"/>

  <!-- Glowing Fireflies -->
  <circle cx="180" cy="280" r="15" fill="url(#mintGlow)"/>
  <circle cx="180" cy="280" r="3" fill="#FFF"/>
  <circle cx="420" cy="240" r="20" fill="url(#mintGlow)"/>
  <circle cx="420" cy="240" r="4" fill="#FFF"/>
  <circle cx="340" cy="380" r="18" fill="url(#mintGlow)"/>
  <circle cx="340" cy="380" r="3" fill="#FFF"/>
  <circle cx="120" cy="520" r="14" fill="url(#mintGlow)"/>
  <circle cx="120" cy="520" r="3" fill="#FFF"/>

  <!-- Wise Whimsical Owl on Branch -->
  <g transform="translate(230, 270)">
    <!-- Owl Body -->
    <ellipse cx="70" cy="95" rx="55" ry="65" fill="#D97706"/>
    <!-- Feather Belly -->
    <ellipse cx="70" cy="105" rx="36" ry="45" fill="#FEF3C7"/>
    <path d="M 55 90 Q 70 100 85 90" fill="none" stroke="#D97706" stroke-width="2"/>
    <path d="M 55 110 Q 70 120 85 110" fill="none" stroke="#D97706" stroke-width="2"/>
    <path d="M 58 130 Q 70 140 82 130" fill="none" stroke="#D97706" stroke-width="2"/>
    <!-- Wings -->
    <path d="M 18 80 Q 2 120 30 145 Z" fill="#B45309"/>
    <path d="M 122 80 Q 138 120 110 145 Z" fill="#B45309"/>
    <!-- Big Eyes with Spectacles -->
    <circle cx="48" cy="55" r="22" fill="#FFF"/>
    <circle cx="92" cy="55" r="22" fill="#FFF"/>
    <circle cx="48" cy="55" r="10" fill="#047857"/>
    <circle cx="92" cy="55" r="10" fill="#047857"/>
    <circle cx="51" cy="52" r="3" fill="#FFF"/>
    <circle cx="95" cy="52" r="3" fill="#FFF"/>
    <!-- Golden Spectacles -->
    <circle cx="48" cy="55" r="23" fill="none" stroke="#FDE047" stroke-width="3"/>
    <circle cx="92" cy="55" r="23" fill="none" stroke="#FDE047" stroke-width="3"/>
    <line x1="71" y1="55" x2="69" y2="55" stroke="#FDE047" stroke-width="3"/>
    <!-- Beak -->
    <path d="M 64 68 L 76 68 L 70 82 Z" fill="#F59E0B"/>
    <!-- Ear tufts -->
    <path d="M 30 38 L 45 15 L 55 35 Z" fill="#B45309"/>
    <path d="M 110 38 L 95 15 L 85 35 Z" fill="#B45309"/>
  </g>

  <!-- Title Banner -->
  <rect x="50" y="650" width="500" height="95" rx="14" fill="#064E3B" fill-opacity="0.9" stroke="#6EE7B7" stroke-width="1.5"/>
  <text x="300" y="688" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="26" fill="#ECFDF5" letter-spacing="0.5">THE SECRET FOREST OF</text>
  <text x="300" y="722" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="28" fill="#6EE7B7" letter-spacing="1">WHISPERING OWLS</text>
  <text x="300" y="635" text-anchor="middle" font-family="'Nunito', sans-serif" font-weight="600" font-size="14" fill="#A7F3D0" letter-spacing="3">BY ROWAN K. MERRICK</text>
</svg>
`),

  barnabyBear: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="oceanSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="55%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#93C5FD"/>
    </linearGradient>
    <linearGradient id="oceanWaves" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1D4ED8"/>
      <stop offset="50%" stop-color="#1E40AF"/>
      <stop offset="100%" stop-color="#172554"/>
    </linearGradient>
  </defs>

  <rect width="600" height="800" fill="url(#oceanSky)"/>
  <!-- Border -->
  <rect x="24" y="24" width="552" height="752" rx="16" fill="none" stroke="#BAE6FD" stroke-width="2.5" stroke-opacity="0.7"/>
  <rect x="32" y="32" width="536" height="736" rx="12" fill="none" stroke="#FFF" stroke-width="1" stroke-opacity="0.25"/>

  <!-- Big Pearlescent Full Moon -->
  <circle cx="300" cy="220" r="110" fill="#FEF3C7" opacity="0.95"/>
  <circle cx="300" cy="220" r="130" fill="#FEF08A" opacity="0.3"/>

  <!-- Sparkling Ocean Waves -->
  <path d="M 0 520 Q 150 490 300 520 T 600 510 L 600 800 L 0 800 Z" fill="url(#oceanWaves)"/>
  <path d="M 0 560 Q 140 530 280 560 T 600 550 L 600 800 L 0 800 Z" fill="#1E3A8A"/>
  <path d="M 0 610 Q 170 580 340 610 T 600 600 L 600 800 L 0 800 Z" fill="#172554"/>

  <!-- Little Wooden Rowboat -->
  <g transform="translate(180, 420)">
    <!-- Sail & Mast -->
    <line x1="120" y1="140" x2="120" y2="10" stroke="#78350F" stroke-width="4"/>
    <path d="M 120 15 L 180 80 L 120 80 Z" fill="#F8FAFC"/>
    <!-- Lantern on Bow -->
    <circle cx="45" cy="115" r="10" fill="#FDE047" opacity="0.8"/>
    <circle cx="45" cy="115" r="3" fill="#FFF"/>
    <!-- Boat Hull -->
    <path d="M 30 130 Q 120 170 210 130 L 195 160 Q 120 185 45 160 Z" fill="#92400E" stroke="#78350F" stroke-width="2"/>
    <!-- Barnaby Bear Inside -->
    <!-- Bear Body & Scarf -->
    <ellipse cx="120" cy="110" rx="32" ry="28" fill="#78350F"/>
    <!-- Red Striped Scarf -->
    <path d="M 100 115 Q 120 125 140 115" fill="none" stroke="#EF4444" stroke-width="8" stroke-linecap="round"/>
    <!-- Bear Head -->
    <circle cx="120" cy="80" r="26" fill="#92400E"/>
    <!-- Ears -->
    <circle cx="102" cy="62" r="10" fill="#92400E"/>
    <circle cx="102" cy="62" r="6" fill="#FDE68A"/>
    <circle cx="138" cy="62" r="10" fill="#92400E"/>
    <circle cx="138" cy="62" r="6" fill="#FDE68A"/>
    <!-- Snout & Eyes -->
    <ellipse cx="120" cy="85" rx="12" ry="9" fill="#FDE68A"/>
    <circle cx="120" cy="81" r="4" fill="#451A03"/>
    <circle cx="112" cy="76" r="3" fill="#451A03"/>
    <circle cx="128" cy="76" r="3" fill="#451A03"/>
    <!-- Friendly Dolphin jumping in distance -->
    <path d="M -70 80 Q -45 50 -20 85" fill="none" stroke="#60A5FA" stroke-width="3" stroke-linecap="round"/>
  </g>

  <!-- Title Banner -->
  <rect x="50" y="650" width="500" height="95" rx="14" fill="#172554" fill-opacity="0.9" stroke="#93C5FD" stroke-width="1.5"/>
  <text x="300" y="688" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="28" fill="#EFF6FF" letter-spacing="0.5">BARNABY BEAR &amp; THE</text>
  <text x="300" y="722" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="30" fill="#93C5FD" letter-spacing="1">MOONLIT OCEAN</text>
  <text x="300" y="635" text-anchor="middle" font-family="'Nunito', sans-serif" font-weight="600" font-size="14" fill="#BFDBFE" letter-spacing="3">BY MAISIE CALLAGHAN</text>
</svg>
`),

  clockworkDragon: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <defs>
    <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4C1D95"/>
      <stop offset="40%" stop-color="#BE185D"/>
      <stop offset="70%" stop-color="#F97316"/>
      <stop offset="100%" stop-color="#FDE047"/>
    </linearGradient>
  </defs>

  <rect width="600" height="800" fill="url(#sunsetSky)"/>
  <!-- Border -->
  <rect x="24" y="24" width="552" height="752" rx="16" fill="none" stroke="#FDE047" stroke-width="2.5" stroke-opacity="0.7"/>
  <rect x="32" y="32" width="536" height="736" rx="12" fill="none" stroke="#FFF" stroke-width="1" stroke-opacity="0.25"/>

  <!-- Cobblestone Clocktower Silhouette -->
  <path d="M 210 260 L 300 150 L 390 260 L 370 700 L 230 700 Z" fill="#312E81"/>
  <!-- Clock Face -->
  <circle cx="300" cy="340" r="50" fill="#FFFBEB" stroke="#B45309" stroke-width="5"/>
  <!-- Clock Roman Numerals / Hands -->
  <circle cx="300" cy="340" r="4" fill="#78350F"/>
  <line x1="300" y1="340" x2="300" y2="305" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
  <line x1="300" y1="340" x2="325" y2="340" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>

  <!-- Clocktower Roof Spire -->
  <polygon points="300,90 280,160 320,160" fill="#D97706"/>
  <circle cx="300" cy="85" r="7" fill="#FDE047"/>

  <!-- Friendly Brass Clockwork Dragon on Tower Top -->
  <g transform="translate(190, 140)">
    <!-- Dragon Tail with tiny gear -->
    <path d="M 60 110 Q 20 130 10 100 Q 5 80 25 70" fill="none" stroke="#B45309" stroke-width="6" stroke-linecap="round"/>
    <circle cx="15" cy="85" r="8" fill="#F59E0B"/>
    <!-- Dragon Body (Brass plates) -->
    <ellipse cx="100" cy="90" rx="42" ry="32" fill="#D97706"/>
    <ellipse cx="100" cy="90" rx="34" ry="24" fill="#F59E0B"/>
    <!-- Dragon Wing (Ornate clockwork fins) -->
    <path d="M 85 75 Q 50 20 110 30 Q 95 55 95 75 Z" fill="#FDE68A" stroke="#B45309" stroke-width="2"/>
    <!-- Neck & Head -->
    <path d="M 125 80 Q 155 60 165 40" fill="none" stroke="#D97706" stroke-width="16" stroke-linecap="round"/>
    <circle cx="170" cy="36" r="22" fill="#F59E0B"/>
    <!-- Cute friendly eye -->
    <circle cx="176" cy="32" r="5" fill="#1E293B"/>
    <circle cx="178" cy="30" r="2" fill="#FFF"/>
    <!-- Little puff of playful golden steam -->
    <circle cx="196" cy="28" r="4" fill="#FFF" opacity="0.8"/>
    <circle cx="206" cy="24" r="6" fill="#FFF" opacity="0.6"/>
    <circle cx="218" cy="18" r="8" fill="#FFF" opacity="0.4"/>
  </g>

  <!-- Title Banner -->
  <rect x="50" y="650" width="500" height="95" rx="14" fill="#312E81" fill-opacity="0.9" stroke="#FDE047" stroke-width="1.5"/>
  <text x="300" y="688" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="26" fill="#FFFBEB" letter-spacing="0.5">THE CLOCKWORK DRAGON OF</text>
  <text x="300" y="722" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-weight="700" font-size="28" fill="#FDE047" letter-spacing="1">CLOCKTOWER HILL</text>
  <text x="300" y="635" text-anchor="middle" font-family="'Nunito', sans-serif" font-weight="600" font-size="14" fill="#FED7AA" letter-spacing="3">BY THEODORE FINCH</text>
</svg>
`),

  // High quality inside pages preview
  insideSpreadPage1: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%">
  <rect width="1000" height="650" fill="#FAF6EE"/>
  <!-- Book spine fold line -->
  <line x1="500" y1="0" x2="500" y2="650" stroke="#E2D9C8" stroke-width="3"/>
  <rect x="496" y="0" width="8" height="650" fill="#000" opacity="0.04"/>

  <!-- Left Page: Story Text & Dedication Header -->
  <g transform="translate(60, 80)">
    <rect x="0" y="0" width="380" height="490" rx="12" fill="#FFFDF8" stroke="#EAE0D0" stroke-width="1"/>
    <text x="40" y="60" font-family="'Fredoka', cursive, sans-serif" font-size="24" font-weight="700" fill="#1E293B">Chapter One: The Secret Glow</text>
    <path d="M 40 75 L 140 75" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
    <text x="40" y="125" font-family="'Nunito', sans-serif" font-size="15" fill="#475569" width="300">
      <tspan x="40" dy="0">Oliver tucked his woolen blanket up to his chin,</tspan>
      <tspan x="40" dy="28">listening to the soft whistle of the summer wind</tspan>
      <tspan x="40" dy="28">outside his bedroom window.</tspan>
      <tspan x="40" dy="40">Suddenly, a speck of golden dust floated down,</tspan>
      <tspan x="40" dy="28">illuminating the dark like a tiny lantern...</tspan>
    </text>
    <!-- Page Number -->
    <text x="190" y="450" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="12" fill="#94A3B8">· 4 ·</text>
  </g>

  <!-- Right Page: Full-bleed Full Color Art -->
  <g transform="translate(540, 80)">
    <rect x="0" y="0" width="400" height="490" rx="12" fill="#2D3A68"/>
    <!-- Illustration elements -->
    <circle cx="200" cy="200" r="100" fill="#FEF08A" opacity="0.2"/>
    <circle cx="200" cy="200" r="50" fill="#FEF3C7" opacity="0.8"/>
    <text x="200" y="360" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-size="18" fill="#FFF">Full Color Premium Matte Print</text>
    <text x="200" y="385" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="13" fill="#CBD5E1">FSC-Certified 170gsm Heavyweight Silk Paper</text>
    <text x="200" y="450" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="12" fill="#94A3B8">· 5 ·</text>
  </g>
</svg>
`),

  insideDedicationSpread: svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%">
  <rect width="1000" height="650" fill="#FAF6EE"/>
  <line x1="500" y1="0" x2="500" y2="650" stroke="#E2D9C8" stroke-width="3"/>
  <rect x="496" y="0" width="8" height="650" fill="#000" opacity="0.04"/>

  <!-- Dedication Leaf Preview -->
  <g transform="translate(100, 100)">
    <rect x="0" y="0" width="800" height="450" rx="16" fill="#FFFDF8" stroke="#EAE0D0" stroke-width="1.5"/>
    <rect x="20" y="20" width="760" height="410" rx="12" fill="none" stroke="#FDE047" stroke-width="1" stroke-dasharray="4,4"/>
    
    <text x="400" y="100" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-size="28" font-weight="700" fill="#1E293B">Special Printed Dedication</text>
    <text x="400" y="135" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="14" fill="#64748B" letter-spacing="2">PRINTED ON THE OPENING LEAF OF YOUR KEEPSAKE BOOK</text>
    
    <!-- Dedication parchment box -->
    <rect x="150" y="170" width="500" height="180" rx="12" fill="#FEF9C3" fill-opacity="0.5" stroke="#FCD34D" stroke-width="1"/>
    <text x="400" y="225" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-style="italic" font-size="20" fill="#1E293B">"To our dearest Leo,</text>
    <text x="400" y="260" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="16" fill="#334155">May your dreams always shine as bright as the stars above.</text>
    <text x="400" y="295" text-anchor="middle" font-family="'Fredoka', cursive, sans-serif" font-size="18" fill="#B45309">Love forever, Grandma &amp; Grandad xx"</text>

    <text x="400" y="390" text-anchor="middle" font-family="'Nunito', sans-serif" font-size="12" fill="#94A3B8">Every dedication is professionally typeset and printed directly into the binding.</text>
  </g>
</svg>
`)
};
