import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { site } from './config/site.js';
import { projects } from './config/projects.js';
import Hero from './components/Hero.jsx';
import ArchSequence from './components/ArchSequence.jsx';
import ProjectDetail, { ProjectMedia, mediaNote } from './components/ProjectDetail.jsx';
import Wordmark from './components/Wordmark.jsx';

gsap.registerPlugin(Flip);

// Placeholder values in config are written in [brackets]; they render as text, never as links.
const isPlaceholder = (v) => typeof v === 'string' && v.startsWith('[');

function Projects({ onOpen, hiddenProject }) {
  return (
    <section className="projects" id="projetos" aria-labelledby="projetos-title">
      <header className="section-head">
        <h2 className="section-title" id="projetos-title">
          {site.projects.heading}
        </h2>
        <p className="section-intro">{site.projects.intro}</p>
      </header>

      <ol className="project-list">
        {projects.map((p) => {
          const note = mediaNote(p);
          return (
            <li key={p.id} className={`project-row${hiddenProject === p.id ? ' is-lifted' : ''}`}>
              <button
                type="button"
                className="project-row__media"
                onClick={(e) => onOpen(p.id, e.currentTarget.querySelector('[data-flip-id]'))}
                aria-label={`Abrir projeto ${p.number}`}
              >
                <span className="project-row__frame" data-flip-id={`media-${p.id}`}>
                  <ProjectMedia project={p} />
                </span>
              </button>
              <div className="project-row__text">
                <span className="project-row__num">{p.number}</span>
                <h3 className="project-row__name">{p.name}</h3>
                <p className="project-row__lead">{p.lead}</p>
                <p className="project-row__where">
                  {p.location}, {p.year}
                </p>
                <button
                  type="button"
                  className="link-quiet"
                  onClick={(e) =>
                    onOpen(p.id, e.currentTarget.closest('.project-row').querySelector('[data-flip-id]'))
                  }
                >
                  Ver projeto
                </button>
                {note && <p className="placeholder-note">{note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Studio() {
  const { studio } = site;
  return (
    <section className="studio" id="estudio" aria-labelledby="estudio-title">
      <h2 className="section-title" id="estudio-title">
        {studio.heading}
      </h2>
      <div className="studio__text">
        {studio.text.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      <dl className="principles">
        {studio.principles.map((p) => (
          <div key={p.title} className="principle">
            <dt>{p.title}</dt>
            <dd>{p.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Contact() {
  const { contact } = site;
  const handle = contact.instagram.replace(/^@/, '');
  return (
    <section className="contact" id="contato" aria-labelledby="contato-title">
      <h2 className="contact__heading" id="contato-title">
        {contact.heading}
      </h2>
      <ul className="contact__list">
        <li>
          {isPlaceholder(contact.email) ? contact.email : <a href={`mailto:${contact.email}`}>{contact.email}</a>}
        </li>
        <li>
          {isPlaceholder(contact.instagram) ? (
            contact.instagram
          ) : (
            <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
        </li>
        <li>{isPlaceholder(contact.phone) ? contact.phone : <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>}</li>
        <li>{contact.address}</li>
      </ul>
    </section>
  );
}

export default function App() {
  const [open, setOpen] = useState(null); // { id, flipState, source }
  const detailRef = useRef(null);

  const onOpen = useCallback((id, sourceEl) => {
    const flipState = sourceEl ? Flip.getState(sourceEl) : null;
    setOpen({ id, flipState, source: sourceEl });
  }, []);

  const returnTarget = useCallback(() => {
    const el = open?.source;
    return el && el.isConnected ? el : null;
  }, [open]);

  const onClosed = useCallback(() => setOpen(null), []);

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !!open);
  }, [open]);

  const hiddenProject = open?.source ? open.id : null;

  return (
    <>
      <main>
        <Hero onOpen={onOpen} hiddenProject={hiddenProject} />
        <ArchSequence onOpen={onOpen} />
        <Projects onOpen={onOpen} hiddenProject={hiddenProject} />
        <Studio />
        <Contact />
      </main>

      <footer className="site-foot">
        <Wordmark className="wordmark--small" />
        <p className="site-foot__note">{site.footnote}</p>
      </footer>

      {open && (
        <ProjectDetail
          key={open.id}
          ref={detailRef}
          id={open.id}
          flipState={open.flipState}
          returnTarget={returnTarget}
          onClosed={onClosed}
        />
      )}
    </>
  );
}
