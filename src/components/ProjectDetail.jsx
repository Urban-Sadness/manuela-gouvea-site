import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { projectById } from '../config/projects.js';
import { prefersReducedMotion } from '../lib/motion.js';
import { LightScene, MaterialsScene, SectionSketch } from './drawings.jsx';
import Wordmark from './Wordmark.jsx';

gsap.registerPlugin(Flip);

export function ProjectMedia({ project, eager = false }) {
  if (project.image) {
    return <img src={project.image.src} alt={project.image.alt} loading={eager ? 'eager' : 'lazy'} draggable="false" />;
  }
  if (project.scene === 'light') return <LightScene className="fill" seed={3} />;
  return <MaterialsScene className="fill" />;
}

export const mediaNote = (project) =>
  project.image?.reference
    ? project.image.credit
    : !project.image
      ? 'Imagem provisória — fotografia do projeto em produção.'
      : null;

/*
  The photograph is "lifted" from the board: Flip animates the same image from
  its pinned position to the hero slot of the detail view, and back on close.
*/
const ProjectDetail = forwardRef(function ProjectDetail({ id, flipState, returnTarget, onClosed }, ref) {
  const project = projectById(id);
  const rootRef = useRef(null);
  const mediaRef = useRef(null);
  const closing = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      if (reduce) {
        gsap.from(root, { opacity: 0, duration: 0.3 });
        return;
      }
      gsap.fromTo(q('.detail__veil'), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' });
      if (flipState) {
        Flip.from(flipState, {
          targets: mediaRef.current,
          duration: 1.15,
          ease: 'power3.inOut',
          absolute: true,
          zIndex: 5,
        });
      } else {
        gsap.from(mediaRef.current, { opacity: 0, scale: 1.04, duration: 1.1, ease: 'power3.out' });
      }
      gsap.from(q('[data-in]'), { opacity: 0, y: 18, duration: 0.9, ease: 'power3.out', stagger: 0.07, delay: flipState ? 0.6 : 0.25 });
    }, root);
    root.focus({ preventScroll: true });
    return () => ctx.revert();
  }, []);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    const root = rootRef.current;
    const target = returnTarget?.();
    const reduce = prefersReducedMotion();
    gsap.to(root.querySelectorAll('[data-in]'), { opacity: 0, duration: 0.3 });
    gsap.to(root.querySelector('.detail__veil'), { opacity: 0, duration: 0.8, delay: 0.25, ease: 'power2.inOut' });
    if (target && !reduce) {
      // set the photograph back down where it came from
      Flip.fit(mediaRef.current, target, { duration: 1.05, ease: 'power3.inOut', absolute: true, onComplete: onClosed });
    } else {
      gsap.to(root, { opacity: 0, duration: 0.45, onComplete: onClosed });
    }
  };

  useImperativeHandle(ref, () => ({ close }));

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!project) return null;
  const note = mediaNote(project);

  return (
    <div className="detail" ref={rootRef} role="dialog" aria-modal="true" aria-label={`Projeto ${project.number}`} tabIndex={-1}>
      <div className="detail__veil" />
      <div className="detail__scroll">
        <header className="detail__bar" data-in>
          <Wordmark className="wordmark--small" showDiscipline={false} />
          <button type="button" className="link-quiet" onClick={close}>
            ← Voltar ao painel
          </button>
        </header>

        <div className="detail__grid">
          <div className="detail__media" ref={mediaRef} data-flip-id={`media-${project.id}`}>
            <ProjectMedia project={project} eager />
          </div>

          <div className="detail__text">
            <span className="eyebrow" data-in>
              {project.number} / Projeto
            </span>
            <h2 className="detail__name" data-in>
              {project.name}
            </h2>
            <p className="detail__lead" data-in>
              {project.lead}
            </p>
            <dl className="meta" data-in>
              <div><dt>Local</dt><dd>{project.location}</dd></div>
              <div><dt>Programa</dt><dd>{project.program}</dd></div>
              <div><dt>Ano</dt><dd>{project.year}</dd></div>
              <div><dt>Status</dt><dd>{project.status}</dd></div>
            </dl>
            <p className="detail__summary" data-in>
              {project.summary}
            </p>
            {note && (
              <p className="placeholder-note" data-in>
                {note}
              </p>
            )}
          </div>
        </div>

        <div className="detail__more" data-in>
          <figure className="detail__drawing">
            <div className="graph graph--flat">
              <SectionSketch className="fill" />
            </div>
            <figcaption>Desenho ilustrativo — substituir pelos desenhos do projeto.</figcaption>
          </figure>
          <figure className="detail__materials">
            <div className="swatch-row">
              <span className="sample sample--tiles sample--flat">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i} className="tile" style={{ '--t': [0, 2, 1, 1, 0, 2, 2, 1, 0][i] }} />
                ))}
              </span>
              <span className="fabric fabric--flat" />
              <span className="sample sample--stone sample--flat" />
            </div>
            <figcaption>Materiais — cerâmica, linho, travertino. Paleta provisória.</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
});

export default ProjectDetail;
