// Hand-built SVG drawings and placeholder scenes used on the pinboard,
// in the project pages and in the editorial section.

const ink = 'var(--ink-line)';

/* Plaster wall with dappled leaf shadows — a drawn placeholder for project photography. */
export function LightScene({ className = '', seed = 1 }) {
  const leaves = [];
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 46; i++) {
    const x = 120 + rnd() * 220;
    const y = -20 + rnd() * 250;
    leaves.push({ x, y, rx: 7 + rnd() * 11, ry: 3 + rnd() * 5, r: rnd() * 180 });
  }
  return (
    <svg className={className} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`wall${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EFE6D7" />
          <stop offset="1" stopColor="#D9C9B2" />
        </linearGradient>
        <linearGradient id={`floor${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B58E6C" />
          <stop offset="1" stopColor="#8E6A4E" />
        </linearGradient>
        <filter id={`soft${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
        <filter id={`plaster${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.3  0 0 0 0.10 0" />
        </filter>
      </defs>
      <rect width="300" height="400" fill={`url(#wall${seed})`} />
      {/* sun patch on the wall */}
      <polygon points="110,0 300,0 300,300 60,330" fill="#FBF4E6" opacity="0.55" filter={`url(#soft${seed})`} />
      {/* arched niche */}
      <path d="M40 330 V170 A55 55 0 0 1 150 170 V330 Z" fill="#E4D6C1" />
      <path d="M40 330 V170 A55 55 0 0 1 150 170 V330" fill="none" stroke="#CDBBA0" strokeWidth="1.2" />
      <path d="M48 330 V172 A47 47 0 0 1 142 172 V330" fill="#D7C5AA" opacity="0.6" />
      {/* leaf shadows */}
      <g fill="#6B6A4E" opacity="0.32" filter={`url(#soft${seed})`}>
        {leaves.map((l, i) => (
          <ellipse key={i} cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} transform={`rotate(${l.r} ${l.x} ${l.y})`} />
        ))}
        <path d="M300 30 C250 60 220 110 190 210" stroke="#6B6A4E" strokeWidth="3" fill="none" />
      </g>
      {/* floor */}
      <rect y="330" width="300" height="70" fill={`url(#floor${seed})`} />
      <g stroke="#7B5A41" strokeWidth="0.8" opacity="0.5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={-40 + i * 60} y1="400" x2={40 + i * 40} y2="330" />
        ))}
      </g>
      {/* ceramic vase in niche */}
      <path d="M86 330 C78 316 80 300 90 294 C88 288 90 284 95 284 C100 284 102 288 100 294 C110 300 112 316 104 330 Z" fill="#AB6245" opacity="0.9" />
      <rect width="300" height="400" filter={`url(#plaster${seed})`} />
    </svg>
  );
}

/* Material composition — placeholder for a future project. */
export function MaterialsScene({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="msNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.12 0" />
        </filter>
        <filter id="msTrav">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.08" numOctaves="3" seed="4" />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.48  0 0 0 0 0.38  0 0 0 0.5 -0.1" />
        </filter>
      </defs>
      <rect width="300" height="400" fill="#E8DFD0" />
      <rect x="0" y="250" width="300" height="150" fill="#E3D6C2" />
      <rect x="0" y="250" width="300" height="150" filter="url(#msTrav)" />
      <rect x="40" y="60" width="120" height="190" fill="#555A43" />
      <rect x="130" y="120" width="130" height="130" fill="#AB6245" />
      <circle cx="210" cy="90" r="34" fill="#B7AA98" />
      <rect x="60" y="230" width="190" height="20" fill="#4B3529" />
      <rect width="300" height="400" filter="url(#msNoise)" />
    </svg>
  );
}

/* Section drawing on graph paper — "corte AA". */
export function SectionSketch({ className = '', labels = true }) {
  return (
    <svg className={className} viewBox="0 0 320 210" aria-hidden="true">
      <g fill="none" stroke={ink} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 168 H306" strokeWidth="1.4" />
        <g stroke="#9C8F7E" strokeWidth="0.6">
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={i} x1={16 + i * 10} y1="170" x2={10 + i * 10} y2="178" />
          ))}
        </g>
        <path d="M52 168 V96 M52 96 L120 56 L190 96 V168" />
        <path d="M44 100 L120 52 L198 100" strokeWidth="0.8" />
        <path d="M190 96 H244 V168 M244 92 V168" strokeWidth="1.6" />
        <path d="M60 168 V100" strokeWidth="2.4" stroke="#4B3529" />
        <path d="M70 140 H110 V152 H70 Z M122 150 H146" strokeWidth="0.8" />
        <circle cx="120" cy="104" r="3" strokeWidth="0.8" />
        <path d="M120 80 V101" strokeWidth="0.6" />
        <path d="M212 168 l4 -14 l4 14 M216 154 v-12 M211 147 h10" strokeWidth="0.8" />
        <circle cx="216" cy="138" r="3.4" strokeWidth="0.8" />
        <path d="M252 168 v12 h38 v-12" strokeWidth="0.9" />
        <circle cx="290" cy="112" r="26" strokeDasharray="2 3" strokeWidth="0.7" />
        <path d="M290 138 V168" strokeWidth="0.8" />
        <path d="M52 192 H244 M52 188 v8 M190 188 v8 M244 188 v8" strokeWidth="0.6" />
        <path d="M16 96 H34 M16 56 H34 M16 168 H34" strokeWidth="0.5" stroke="#9C8F7E" />
      </g>
      {labels && (
        <g fill="#6E6255" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="0.8">
          <text x="18" y="52">+5,00</text>
          <text x="18" y="92">+3,10</text>
          <text x="18" y="164">±0,00</text>
          <text x="112" y="202">8,00</text>
          <text x="210" y="202">3,00</text>
          <text x="14" y="18" fontSize="7.5" letterSpacing="2.2" fill="#4B3529">CORTE AA</text>
        </g>
      )}
    </svg>
  );
}

/* Loose pencil study of an arch, for tracing paper. */
export function ArchStudy({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 200 240" aria-hidden="true">
      <g fill="none" stroke="#5A4A3E" strokeLinecap="round" opacity="0.85">
        <path d="M40 220 V110 A60 60 0 0 1 160 110 V220" strokeWidth="1.3" />
        <path d="M46 220 V111 A54 54 0 0 1 154 111 V220" strokeWidth="0.6" opacity="0.6" />
        <path d="M24 220 V96 A76 76 0 0 1 176 96 V220" strokeWidth="0.8" opacity="0.7" />
        <path d="M100 18 V232" strokeWidth="0.5" strokeDasharray="5 4" opacity="0.6" />
        <path d="M10 110 H190" strokeWidth="0.5" opacity="0.5" />
        <path d="M14 50 A86 86 0 0 1 186 50" strokeWidth="0.5" opacity="0.4" />
        <path d="M70 220 V150 H130 V220 M100 150 V220" strokeWidth="0.7" opacity="0.7" />
        <path d="M8 222 H192" strokeWidth="1" />
      </g>
      <text x="10" y="236" fontFamily="Caveat, cursive" fontSize="13" fill="#5A4A3E">r = 1,50</text>
    </svg>
  );
}

/* Pressed leaf on herbarium paper — Schinus terebinthifolia (aroeira). */
export function PressedLeaf({ className = '' }) {
  const pairs = [0, 1, 2, 3, 4, 5];
  return (
    <svg className={className} viewBox="0 0 160 220" aria-hidden="true">
      <g transform="rotate(-14 80 110)">
        <path d="M80 206 C78 160 82 110 80 30" stroke="#5E5A3C" strokeWidth="1.6" fill="none" />
        {pairs.map((i) => {
          const y = 176 - i * 26;
          const len = 30 - i * 2.2;
          return (
            <g key={i} fill="#62653F" stroke="#4E5133" strokeWidth="0.5">
              <path d={`M80 ${y} C${80 - len * 0.5} ${y - 12}, ${80 - len} ${y - 6}, ${80 - len - 4} ${y + 2} C${80 - len} ${y + 6}, ${80 - len * 0.4} ${y + 6}, 80 ${y}`} opacity={0.85 + (i % 2) * 0.1} />
              <path d={`M80 ${y - 6} C${80 + len * 0.5} ${y - 18}, ${80 + len} ${y - 12}, ${80 + len + 4} ${y - 4} C${80 + len} ${y}, ${80 + len * 0.4} ${y}, 80 ${y - 6}`} opacity={0.9 - (i % 2) * 0.1} />
            </g>
          );
        })}
        <path d="M80 30 C70 20 72 8 80 2 C88 8 90 20 80 30" fill="#6B6E46" />
      </g>
    </svg>
  );
}
