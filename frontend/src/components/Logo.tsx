import { Link } from 'react-router-dom';

export function ChefHat({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <path d="M17 33c-5 0-9-4-9-9s4.6-9.3 10.2-8.1C20 10 25.6 6 32 6s12 4 13.8 9.9C51.4 14.7 56 19 56 24s-4 9-9 9v12H17Z"
        fill="#FFFBF3" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M17 45h30v6a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3Z" fill="#F2B230" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 38s-7-4.2-7-8.4c0-2.3 1.8-3.8 3.7-3.8 1.4 0 2.6.8 3.3 1.9.7-1.1 1.9-1.9 3.3-1.9 1.9 0 3.7 1.5 3.7 3.8 0 4.2-7 8.4-7 8.4Z" fill="#E8752A" className="hat__heart" />
      <path d="M8 58c6-2 10 1 14-1M42 57c5 1 9-2 14 0" stroke="#1E7B3A" className="hat__leaves" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label="Les Beignets de Mamie — accueil">
      <span className="logo__hat"><ChefHat /></span>
      <span className="logo__text">
        <span className="logo__line1">Les beignets</span>
        <span className="logo__line2"><small>de</small>Mamie</span>
        <span className="logo__tag">— Le goût authentique de l’Afrique —</span>
      </span>
    </Link>
  );
}
