import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../config/assets.js';
import { prefersReducedMotion, isFinePointer } from '../lib/motion.js';
import { LightScene, SectionSketch, ArchStudy, PressedLeaf } from './drawings.jsx';

gsap.registerPlugin(ScrollTrigger);

/*
  Board composition. Positions are % of the board, widths are % of board width (cqw),
  so the arrangement keeps its proportions at every size.
  depth: 0 (flat on the cork) … 1 (furthest from the wall) — drives parallax and shadow.
*/
const ITEMS = [
  { id: 'title', kind: 'title', x: 6, y: 7, w: 31, rot: -1.6, depth: 0.35, fastener: 'pin' },
  { id: 'photo-p01', kind: 'photo', project: 'p01', x: 29, y: 19, w: 43, rot: 1.1, depth: 0.8, fastener: 'pin' },
  { id: 'tracing', kind: 'tracing', x: 62, y: 9, w: 23, rot: 4.5, depth: 0.95, fastener: 'tape' },
  { id: 'section', kind: 'section', x: 4, y: 37, w: 29, rot: -3.2, depth: 0.45, fastener: 'pin' },
  { id: 'note', kind: 'note', x: 21, y: 56, w: 17, rot: -5, depth: 0.9, fastener: 'pin' },
  { id: 'photo-p02', kind: 'scene', project: 'p02', x: 63, y: 47, w: 27, rot: -2.2, depth: 0.6, fastener: 'pin' },
  { id: 'tiles', kind: 'tiles', x: 40, y: 63, w: 19, rot: 2.6, depth: 0.5, fastener: 'none' },
  { id: 'linen', kind: 'linen', x: 6, y: 71, w: 16, rot: -3.5, depth: 0.3, fastener: 'pin' },
  { id: 'stone', kind: 'stone', x: 25, y: 79, w: 14, rot: 1.5, depth: 0.55, fastener: 'none' },
  { id: 'leaf', kind: 'leaf', x: 79, y: 74, w: 15, rot: 3.2, depth: 0.4, fastener: 'tape' },
];

function Fastener({ type }) {
  if (type === 'pin') return <span className="pin__fastener pin__fastener--pin" aria-hidden="true" />;
  if (type === 'tape') return <span className="pin__fastener pin__fastener--tape" aria-hidden="true" />;
  return null;
}

function ItemContent({ item, onOpen }) {
  switch (item.kind) {
    case 'photo':
      return (
        <button
          type="button"
          className="pin__body print print--project"
          onClick={(e) => onOpen(item.project, e.currentTarget.querySelector('[data-flip-id]'))}
          aria-label="Explorar projeto 01"
        >
          <span className="print__img" data-flip-id={`media-${item.project}`}>
            <img src={assets.archPhoto.src} alt={assets.archPhoto.alt} draggable="false" />
          </span>
          <span className="print__caption">
            <span>01 · [nome do projeto]</span>
            {assets.archPhoto.reference && <span className="print__ref">imagem de referência</span>}
          </span>
          <span className="pin__explore">Explorar projeto →</span>
        </button>
      );
    case 'scene':
      return (
        <button
          type="button"
          className="pin__body print print--project print--portrait"
          onClick={(e) => onOpen(item.project, e.currentTarget.querySelector('[data-flip-id]'))}
          aria-label="Explorar projeto 02"
        >
          <span className="print__img" data-flip-id={`media-${item.project}`}>
            <LightScene className="fill" seed={3} />
          </span>
          <span className="print__caption">
            <span>02 · luz e sombra</span>
            <span className="print__ref">imagem provisória</span>
          </span>
          <span className="pin__explore">Explorar projeto →</span>
        </button>
      );
    case 'title':
      return (
        <div className="pin__body card-title">
          <span className="card-title__eyebrow">Caderno de referências</span>
          <span className="card-title__main">Entre o mar<br />e a casa</span>
          <span className="card-title__rule" />
          <span className="card-title__meta">Búzios · Edição 01 · 2026</span>
        </div>
      );
    case 'tracing':
      return (
        <div className="pin__body tracing">
          <ArchStudy className="fill" />
        </div>
      );
    case 'section':
      return (
        <div className="pin__body graph">
          <SectionSketch className="fill" />
        </div>
      );
    case 'note':
      return (
        <div className="pin__body note">
          <span>luz da manhã na varanda —</span>
          <span>manter o arco aberto</span>
          <span>para o mar.</span>
          <span className="note__sign">M.</span>
        </div>
      );
    case 'tiles':
      return (
        <div className="pin__body sample sample--tiles" aria-label="Amostra de cerâmica esmaltada">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="tile" style={{ '--t': [0, 2, 1, 1, 0, 2, 2, 1, 0][i] }} />
          ))}
        </div>
      );
    case 'linen':
      return (
        <div className="pin__body fabric" aria-label="Amostra de linho">
          <span className="fabric__label">linho · oliva</span>
        </div>
      );
    case 'stone':
      return <div className="pin__body sample sample--stone" aria-label="Amostra de travertino" />;
    case 'leaf':
      return (
        <div className="pin__body herbarium">
          <PressedLeaf className="fill" />
          <span className="herbarium__label">
            <i>Schinus terebinthifolia</i>
            <br />
            aroeira · restinga
          </span>
        </div>
      );
    default:
      return null;
  }
}

export default function Pinboard({ onOpen, hiddenProject }) {
  const boardRef = useRef(null);

  useLayoutEffect(() => {
    const board = boardRef.current;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const pins = gsap.utils.toArray('.pin', board);

      if (!reduce) {
        // Settle: items arrive slightly lifted and rotated, then rest on the cork.
        gsap.from(pins.map((p) => p.querySelector('.pin__intro')), {
          opacity: 0,
          y: -16,
          scale: 1.045,
          rotation: () => gsap.utils.random(-3, 3),
          duration: 1.5,
          ease: 'power3.out',
          stagger: { each: 0.085, from: 'random' },
          delay: 0.25,
          clearProps: 'transform',
        });
        gsap.from(board.querySelectorAll('.pin__fastener'), {
          scale: 0.4,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.05,
          delay: 1.2,
        });
      }

      if (reduce) return;

      if (isFinePointer()) {
        const plane = board.querySelector('.board__plane');
        const movers = pins.map((p) => {
          const d = parseFloat(p.dataset.depth);
          const el = p.querySelector('.pin__depth');
          return {
            d,
            x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
            y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
          };
        });
        const rx = gsap.quickTo(plane, 'rotationX', { duration: 1.4, ease: 'power3.out' });
        const ry = gsap.quickTo(plane, 'rotationY', { duration: 1.4, ease: 'power3.out' });
        const light = { x: 0, y: 0 };
        const setLight = () => {
          board.style.setProperty('--lx', light.x.toFixed(2));
          board.style.setProperty('--ly', light.y.toFixed(2));
        };

        const onMove = (e) => {
          const r = board.getBoundingClientRect();
          if (r.bottom < 0) return;
          const nx = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width) * 2 - 1);
          const ny = gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height) * 2 - 1);
          movers.forEach((m) => {
            m.x(nx * 9 * m.d);
            m.y(ny * 7 * m.d);
          });
          ry(nx * 1.6);
          rx(-ny * 1.2);
          gsap.to(light, { x: -nx, y: -ny, duration: 1.2, ease: 'power3.out', overwrite: true, onUpdate: setLight });
        };
        const onLeave = () => {
          movers.forEach((m) => {
            m.x(0);
            m.y(0);
          });
          rx(0);
          ry(0);
          gsap.to(light, { x: 0, y: 0, duration: 1.4, ease: 'power3.out', overwrite: true, onUpdate: setLight });
        };
        window.addEventListener('pointermove', onMove);
        document.documentElement.addEventListener('pointerleave', onLeave);
        return () => {
          window.removeEventListener('pointermove', onMove);
          document.documentElement.removeEventListener('pointerleave', onLeave);
        };
      }

      // Touch: depth comes from scrolling instead of the pointer.
      pins.forEach((p) => {
        const d = parseFloat(p.dataset.depth);
        gsap.fromTo(
          p.querySelector('.pin__depth'),
          { y: 14 * d },
          { y: -14 * d, ease: 'none', scrollTrigger: { trigger: board, start: 'top bottom', end: 'bottom top', scrub: 0.6 } }
        );
      });
    }, board);
    return () => ctx.revert();
  }, []);

  return (
    <div className="board" ref={boardRef} aria-label="Painel de referências do estúdio">
      <div className="board__surface" aria-hidden="true" />
      <div className="board__plane">
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`pin pin--${item.kind}${item.project ? ' pin--project' : ''}${hiddenProject && item.project === hiddenProject ? ' is-lifted' : ''}`}
            data-depth={item.depth}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.w}cqw`,
              '--rot': `${item.rot}deg`,
              '--d': item.depth,
              zIndex: Math.round(item.depth * 10) + i,
            }}
          >
            <div className="pin__intro">
              <div className="pin__depth">
                <ItemContent item={item} onOpen={onOpen} />
                <Fastener type={item.fastener} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="board__leaves" aria-hidden="true">
        <LeafShadow />
      </div>
      <div className="board__light" aria-hidden="true" />
    </div>
  );
}

/* Soft dappled shadow cast across the whole board, as if from a tree outside the window. */
function LeafShadow() {
  const leaves = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) {
    const x = 560 + rnd() * 460;
    const y = -60 + rnd() * 520;
    leaves.push([x, y, 10 + rnd() * 22, 5 + rnd() * 9, rnd() * 180]);
  }
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMaxYMin slice">
      <defs>
        <filter id="leafBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g fill="#3E3A26" filter="url(#leafBlur)">
        {leaves.map(([x, y, rx, ry, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} />
        ))}
        <path d="M1040 40 C930 90 860 170 790 330" stroke="#3E3A26" strokeWidth="7" fill="none" />
        <path d="M1020 260 C940 280 880 330 840 420" stroke="#3E3A26" strokeWidth="5" fill="none" />
      </g>
    </svg>
  );
}
