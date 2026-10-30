import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { assets } from '../config/assets.js';
import { projects } from '../config/projects.js';
import { site } from '../config/site.js';
import { prefersReducedMotion } from '../lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

/*
  FROM DRAWING TO REALITY
  The elevation is a simplified SVG tracing split into groups (roof, walls,
  columns, arches, details, construction) that animate independently.
  A single "camera" transform drives both the line layers and the arch-shaped
  clip, so the photo is always revealed exactly through the drawn arch.
  At the end the drawn arch lands on the real arch in the photograph
  (geometry in config/assets.js → archPhoto.arch).
*/

// Design space (elevation drawn in these units)
const X0 = 200;
const X1 = 1400;
const WALL_TOP = 430;
const GROUND = 620;
const BAYS = 7;
const BAY = (X1 - X0) / BAYS;
const R = 60; // arch radius
const SPRING = 530;
const APEX = { x: 800, y: SPRING - R };
const FOCUS = 3; // the central arch
const bayCx = (i) => X0 + BAY * (i + 0.5);
const DOORS = [0, 1, 4, 5];

const archPath = (cx, r = R, base = GROUND) => `M${cx - r} ${base} V${SPRING} A${r} ${r} 0 0 1 ${cx + r} ${SPRING} V${base}`;

function ElevationFills() {
  return (
    <g className="seq-fills">
      <path className="fill-roof" d={`M180 430 L330 374 H1270 L1420 430 Z`} />
      <rect className="fill-wall" x={X0} y={WALL_TOP} width={X1 - X0} height={GROUND - WALL_TOP} />
      {Array.from({ length: BAYS }).map((_, i) => (
        <path key={i} className={`fill-glass${i === FOCUS ? ' fill-glass--focus' : ''}`} d={`${archPath(bayCx(i))} Z`} />
      ))}
      {DOORS.map((i) => (
        <rect key={i} className="fill-door" x={bayCx(i) - 38} y={546} width={76} height={GROUND - 546} />
      ))}
    </g>
  );
}

function ElevationLines() {
  return (
    <g className="seq-lines">
      <g data-g="roof">
        <path className="ln ln--b" pathLength="1" d="M180 430 H1420 M180 430 L330 374 H1270 L1420 430" />
        <path className="ln" pathLength="1" d="M186 420 H1414" />
        <g className="seq-fine">
          {Array.from({ length: 38 }).map((_, i) => {
            const x = 340 + i * 25;
            return <path key={i} className="ln ln--f" pathLength="1" d={`M${x} 376 V${419}`} />;
          })}
        </g>
      </g>
      <g data-g="walls">
        <path data-part="top" className="ln" pathLength="1" d={`M${X0} ${WALL_TOP} H${X1}`} />
        <path data-part="left" className="ln" pathLength="1" d={`M${X0} ${WALL_TOP} V${GROUND}`} />
        <path data-part="right" className="ln" pathLength="1" d={`M${X1} ${WALL_TOP} V${GROUND}`} />
        <path data-part="plinth" className="ln ln--f" pathLength="1" d={`M${X0} ${GROUND - 12} H${X1}`} />
      </g>
      <g data-g="columns">
        {Array.from({ length: BAYS - 1 }).map((_, k) => {
          const x = X0 + BAY * (k + 1);
          return (
            <g key={k} data-col={x - APEX.x}>
              <path className="ln ln--f" pathLength="1" d={`M${x - 6} ${SPRING} H${x + 6} M${x} ${WALL_TOP + 14} V${GROUND - 12}`} />
            </g>
          );
        })}
      </g>
      <g data-g="arches">
        {Array.from({ length: BAYS }).map((_, i) => (
          <g key={i} data-arch={i} className={i === FOCUS ? 'arch-focus' : 'arch-other'}>
            <path className="ln ln--b" pathLength="1" d={archPath(bayCx(i))} />
            <path className="ln ln--f" pathLength="1" d={`M${bayCx(i) - R - 8} ${SPRING} A${R + 8} ${R + 8} 0 0 1 ${bayCx(i) + R + 8} ${SPRING}`} />
          </g>
        ))}
      </g>
      <g data-g="details">
        {DOORS.map((i) => {
          const cx = bayCx(i);
          return (
            <path
              key={i}
              className="ln ln--f"
              pathLength="1"
              d={`M${cx - 38} ${GROUND} V546 H${cx + 38} V${GROUND} M${cx} 546 V${GROUND} M${cx - 38} 570 H${cx + 38} M${cx - 38} 596 H${cx + 38}`}
            />
          );
        })}
        {/* human scale figure */}
        <g className="seq-figure">
          <circle className="ln ln--f" pathLength="1" cx={bayCx(4) + 52} cy={566} r={5} />
          <path className="ln ln--f" pathLength="1" d={`M${bayCx(4) + 52} 571 V596 M${bayCx(4) + 44} 580 H${bayCx(4) + 60} M${bayCx(4) + 52} 596 L${bayCx(4) + 46} 620 M${bayCx(4) + 52} 596 L${bayCx(4) + 58} 620`} />
        </g>
        <path className="ln" pathLength="1" d={`M110 ${GROUND} H1490`} />
        <g className="seq-fine">
          {Array.from({ length: 46 }).map((_, i) => (
            <path key={i} className="ln ln--f" pathLength="1" d={`M${130 + i * 30} ${GROUND + 2} l-8 10`} />
          ))}
        </g>
        <g className="seq-dims">
          <path className="ln ln--f" pathLength="1" d={`M${X0} 668 H${X1}`} />
          {Array.from({ length: BAYS + 1 }).map((_, k) => (
            <path key={k} className="ln ln--f" pathLength="1" d={`M${X0 + BAY * k - 5} 673 l10 -10 M${X0 + BAY * k} 660 V676`} />
          ))}
          {Array.from({ length: BAYS }).map((_, i) => (
            <text key={i} className="seq-dimtext" x={bayCx(i)} y={690}>
              3,00
            </text>
          ))}
        </g>
        <g className="seq-trees">
          <circle className="ln ln--dot" cx={140} cy={548} r={46} />
          <path className="ln ln--f" pathLength="1" d={`M140 594 V${GROUND}`} />
          <circle className="ln ln--dot" cx={1460} cy={548} r={46} />
          <path className="ln ln--f" pathLength="1" d={`M1460 594 V${GROUND}`} />
        </g>
      </g>
      <g data-g="construction" opacity="0">
        <circle className="ln ln--f ln--dash" cx={APEX.x} cy={SPRING} r={150} />
        <circle className="ln ln--f ln--dash" cx={APEX.x} cy={SPRING} r={232}  />
        <path className="ln ln--f ln--dash" d={`M${APEX.x} 250 V720`} />
        <path className="ln ln--f" d={`M300 ${SPRING} H1300 M420 ${APEX.y} H1180`} />
        <path className="ln ln--f" d={`M${APEX.x - R - 30} ${SPRING + 4} l0 -8 M${APEX.x + R + 30} ${SPRING + 4} l0 -8`} />
      </g>
    </g>
  );
}

/* ---------- geometry ---------- */

function computeGeometry() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const mobile = vw < 768;
  const photo = assets.archPhoto;
  const k = Math.max(vw / photo.width, vh / photo.height);
  const iw = photo.width * k;
  const ih = photo.height * k;
  // keep the real arch in view: centre it on mobile, natural framing on desktop
  const idealX = mobile ? vw / 2 - photo.arch.cx * k : (vw - iw) / 2;
  const ox = gsap.utils.clamp(vw - iw, 0, idealX);
  const oy = (vh - ih) / 2;
  const F1 = { x: ox + photo.arch.cx * k, y: oy + photo.arch.apexY * k };
  const s1 = (photo.arch.radius * k) / R;

  const s0 = mobile ? (vw * 0.94) / 1380 : Math.min((vw * 0.8) / 1380, (vh * 0.6) / 340);
  const F0 = { x: vw / 2, y: vh * 0.52 + (APEX.y - 540) * s0 };
  const sMid = Math.min((vh * 0.8) / (GROUND - APEX.y), (vw * 0.9) / (2 * R));
  const Fm = { x: vw / 2, y: vh * 0.1 };

  return { vw, vh, mobile, k, iw, ih, ox, oy, F0, Fm, F1, s0, sMid, s1 };
}

function cameraAt(g, u) {
  // u: 0 → base, 1 → arch fills view, 2 → aligned with the real arch
  const seg = u <= 1 ? [g.s0, g.sMid, g.F0, g.Fm, u] : [g.sMid, g.s1, g.Fm, g.F1, u - 1];
  const [sa, sb, Fa, Fb, t] = seg;
  const s = sa * Math.pow(sb / sa, t); // log zoom feels even
  const e = t * t * (3 - 2 * t);
  const fx = Fa.x + (Fb.x - Fa.x) * e;
  const fy = Fa.y + (Fb.y - Fa.y) * e;
  return { s, tx: fx - APEX.x * s, ty: fy - APEX.y * s };
}

export default function ArchSequence({ onOpen }) {
  const reduce = prefersReducedMotion();
  return reduce ? <StaticSequence onOpen={onOpen} /> : <ScrollSequence onOpen={onOpen} />;
}

function ScrollSequence({ onOpen }) {
  const sectionRef = useRef(null);
  const [stage, setStage] = useState(0);
  const project = projects[0];
  const photo = assets.archPhoto;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const svg = section.querySelector('.seq-svg');
    const camGroups = section.querySelectorAll('[data-camera]');
    const photoInner = section.querySelector('.seq-photo--inner');
    const photoOuter = section.querySelector('.seq-photo--outer');
    const progressBar = section.querySelector('.seq-progress__bar');
    let g = computeGeometry();
    const cam = { u: 0, depth: 1.16 };
    let lastStage = -1;

    const place = (el, scale) => {
      // photo, scaled about the real arch's apex so alignment is exact at scale 1
      const w = g.iw * scale;
      const h = g.ih * scale;
      el.setAttribute('x', g.F1.x - (g.F1.x - g.ox) * scale);
      el.setAttribute('y', g.F1.y - (g.F1.y - g.oy) * scale);
      el.setAttribute('width', w);
      el.setAttribute('height', h);
    };

    const render = () => {
      const c = cameraAt(g, cam.u);
      const tf = `translate(${c.tx.toFixed(2)} ${c.ty.toFixed(2)}) scale(${c.s.toFixed(4)})`;
      camGroups.forEach((el) => el.setAttribute('transform', tf));
      svg.style.setProperty('--sw', (1 / c.s).toFixed(5));
      place(photoInner, cam.depth);
    };

    const onResize = () => {
      g = computeGeometry();
      svg.setAttribute('width', g.vw);
      svg.setAttribute('height', g.vh);
      place(photoOuter, 1);
      render();
    };
    onResize();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const allLines = q('.seq-lines .ln[pathLength]');
      gsap.set(allLines, { strokeDasharray: 1, strokeDashoffset: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (g.mobile ? 4.6 : 5.2)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: onResize,
          onUpdate: (self) => {
            progressBar.style.transform = `scaleX(${self.progress})`;
            const s = Math.min(site.sequence.stages.length - 1, Math.floor(self.progress * site.sequence.stages.length * 0.999));
            if (s !== lastStage) {
              lastStage = s;
              setStage(s);
            }
          },
          onToggle: (self) => document.body.classList.toggle('in-sequence', self.isActive),
        },
      });

      // STAGE 1 — the drawing appears
      tl.to(q('[data-g="walls"] .ln, [data-g="roof"] .ln'), { strokeDashoffset: 0, duration: 0.9, stagger: 0.004, ease: 'power2.out' }, 0)
        .to(q('[data-g="arches"] .ln, [data-g="columns"] .ln'), { strokeDashoffset: 0, duration: 0.9, stagger: 0.03, ease: 'power2.out' }, 0.2)
        .to(q('[data-g="details"] .ln[pathLength]'), { strokeDashoffset: 0, duration: 0.8, stagger: 0.004, ease: 'power2.out' }, 0.45)
        .fromTo(q('.seq-fills'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.5)
        .fromTo(q('.ln--dot, .seq-dimtext'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.7);

      // STAGE 2 — the drawing separates into its elements
      const D = 1.8;
      tl.to(q('[data-g="roof"]'), { y: -78, rotation: -0.8, svgOrigin: '800 400', duration: 2.6, ease: 'power1.inOut' }, D)
        .to(q('[data-part="top"]'), { y: -26, duration: 2.4, ease: 'power1.inOut' }, D + 0.1)
        .to(q('[data-part="plinth"]'), { y: 22, duration: 2.4, ease: 'power1.inOut' }, D + 0.1)
        .to(q('[data-part="left"]'), { x: -70, duration: 2.4, ease: 'power1.inOut' }, D + 0.1)
        .to(q('[data-part="right"]'), { x: 70, duration: 2.4, ease: 'power1.inOut' }, D + 0.1)
        .to(q('[data-col]'), { x: (i, el) => parseFloat(el.dataset.col) * 0.14, y: (i) => (i % 2 ? -8 : 10), duration: 2.4, ease: 'power1.inOut' }, D + 0.2)
        .to(q('.arch-other'), {
          x: (i, el) => (bayCx(+el.dataset.arch) - APEX.x) * 0.22,
          y: (i) => [14, -10, 18, -16, 8, -12][i] ?? 0,
          duration: 2.6,
          ease: 'power1.inOut',
        }, D + 0.3)
        .to(q('.seq-dims, .seq-trees, .seq-figure'), { y: 30, opacity: 0, duration: 1.6, ease: 'power1.in' }, D)
        .to(q('[data-g="details"] > .ln, [data-g="details"] > path'), { y: 26, duration: 2, ease: 'power1.inOut' }, D + 0.2)
        .to(q('.fill-roof, .fill-wall, .fill-door, .fill-glass:not(.fill-glass--focus)'), { opacity: 0, duration: 1.4 }, D + 0.2)
        .to(q('.seq-eyebrow'), { opacity: 0, y: -12, duration: 0.8 }, D);

      // STAGE 3 — the camera moves toward the central arch
      tl.to(cam, { u: 1, duration: 3.4, ease: 'power1.inOut', onUpdate: render }, 2.6)
        .to(q('[data-g="roof"], [data-g="walls"], [data-g="columns"], .arch-other, [data-g="details"]'), { opacity: 0.14, duration: 2, ease: 'power1.in' }, 3.6)
        .to(q('[data-g="construction"]'), { opacity: 1, duration: 1.2 }, 3.5);

      // STAGE 4/5 — enter the arch; the real place appears inside it
      tl.fromTo(photoInner, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power1.inOut' }, 5.3)
        .to(q('.fill-glass--focus'), { opacity: 0, duration: 1 }, 5.6)
        .to(cam, { u: 2, depth: 1, duration: 2.4, ease: 'power2.inOut', onUpdate: render }, 6)
        .to(q('[data-g="construction"]'), { opacity: 0, duration: 1 }, 6.4)
        .to(q('[data-g="roof"], [data-g="walls"], [data-g="columns"], .arch-other, [data-g="details"]'), { opacity: 0, duration: 1 }, 6.6);

      // STAGE 6 — the drawing dissolves, the photograph is complete
      tl.fromTo(photoOuter, { opacity: 0 }, { opacity: 1, duration: 1.3, ease: 'power1.inOut' }, 7.9)
        .to(q('.arch-focus .ln'), { strokeDashoffset: -1, duration: 1.2, ease: 'power1.in', stagger: 0.15 }, 8.1)
        .fromTo(q('.seq-title > *'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, 8.7)
        .to({}, { duration: 0.6 });
    }, section);

    return () => {
      ctx.revert();
      document.body.classList.remove('in-sequence');
    };
  }, []);

  return (
    <section className="seq" id="sequencia" ref={sectionRef} aria-label="Do desenho à realidade">
      <svg className="seq-svg" aria-hidden="true">
        <defs>
          <clipPath id="archClip" clipPathUnits="userSpaceOnUse">
            <path data-camera d={`${archPath(APEX.x, R, 2000)} Z`} />
          </clipPath>
        </defs>
        <g data-camera>
          <ElevationFills />
        </g>
        <image className="seq-photo seq-photo--outer" href={photo.src} preserveAspectRatio="none" />
        <image className="seq-photo seq-photo--inner" href={photo.src} preserveAspectRatio="none" clipPath="url(#archClip)" />
        <g data-camera>
          <ElevationLines />
        </g>
      </svg>

      <p className="seq-eyebrow">{site.sequence.eyebrow}</p>

      <div className="seq-stage" aria-hidden="true">
        <span className="seq-stage__num">{String(stage + 1).padStart(2, '0')}</span>
        <span className="seq-stage__name">{site.sequence.stages[stage]}</span>
        <span className="seq-progress">
          <span className="seq-progress__bar" />
        </span>
      </div>

      <div className="seq-title">
        <span className="seq-title__num">{project.number} / Projeto</span>
        <h2 className="seq-title__name">{project.name}</h2>
        <p className="seq-title__lead">{project.lead}</p>
        <button type="button" className="link-quiet" onClick={() => onOpen(project.id, null)}>
          Explorar projeto →
        </button>
        {photo.reference && <span className="seq-title__credit">{photo.credit}</span>}
      </div>
    </section>
  );
}

/* Reduced motion: the same story as two still frames. */
function StaticSequence({ onOpen }) {
  const project = projects[0];
  const photo = assets.archPhoto;
  return (
    <section className="seq seq--static" id="sequencia" aria-label="Do desenho à realidade">
      <p className="seq-eyebrow">{site.sequence.eyebrow}</p>
      <svg className="seq-static-drawing" viewBox="100 340 1400 370" aria-hidden="true" style={{ '--sw': 1.6 }}>
        <ElevationFills />
        <ElevationLines />
      </svg>
      <figure className="seq-static-photo">
        <img src={photo.src} alt={photo.alt} />
        <figcaption className="seq-title seq-title--static">
          <span className="seq-title__num">{project.number} / Projeto</span>
          <h2 className="seq-title__name">{project.name}</h2>
          <p className="seq-title__lead">{project.lead}</p>
          <button type="button" className="link-quiet" onClick={() => onOpen(project.id, null)}>
            Explorar projeto →
          </button>
          {photo.reference && <span className="seq-title__credit">{photo.credit}</span>}
        </figcaption>
      </figure>
    </section>
  );
}
