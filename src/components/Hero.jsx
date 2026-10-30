import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { site } from '../config/site.js';
import { prefersReducedMotion } from '../lib/motion.js';
import Wordmark from './Wordmark.jsx';
import Pinboard from './Pinboard.jsx';

export default function Hero({ onOpen, hiddenProject }) {
  const leftRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 18,
        duration: 1.3,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      });
    }, leftRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" id="inicio">
      <div className="hero__left" ref={leftRef}>
        <header className="hero__top" data-reveal>
          <Wordmark />
          <nav className="nav" aria-label="Principal">
            {site.nav.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="hero__copy">
          <h1 className="hero__statement" data-reveal>
            <span>{site.hero.statement[0]}</span>
            <span className="hero__statement-2">{site.hero.statement[1]}</span>
          </h1>
          <p className="hero__intro" data-reveal>
            {site.hero.intro}
          </p>
        </div>

        <footer className="hero__foot" data-reveal>
          <div className="hero__place">
            <span>{site.hero.place}</span>
            <span>{site.hero.practice}</span>
          </div>
          <a className="scroll-cue" href="#sequencia" aria-label="Rolar para continuar">
            <span className="scroll-cue__line" />
            <span>Role</span>
          </a>
        </footer>
      </div>

      <div className="hero__right">
        <Pinboard onOpen={onOpen} hiddenProject={hiddenProject} />
      </div>
    </section>
  );
}
