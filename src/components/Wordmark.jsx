import { site } from '../config/site.js';
import { assets } from '../config/assets.js';

export default function Wordmark({ className = '', showDiscipline = true }) {
  return (
    <div className={`wordmark ${className}`}>
      {site.useWordmarkImage ? (
        <span
          className="wordmark__img"
          role="img"
          aria-label={site.name}
          style={{
            WebkitMaskImage: `url(${assets.wordmark.src})`,
            maskImage: `url(${assets.wordmark.src})`,
            aspectRatio: assets.wordmark.ratio,
          }}
        />
      ) : (
        <span className="wordmark__text">{site.name}</span>
      )}
      {showDiscipline && <span className="wordmark__sub">{site.discipline}</span>}
    </div>
  );
}
