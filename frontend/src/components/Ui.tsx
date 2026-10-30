import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HeartOutline, LeafIcon, MinusIcon, PlusIcon } from './Icons';

export function SectionTitle({ title, subtitle, light = false, align = 'left' }: { title: string; subtitle?: string; light?: boolean; align?: 'left' | 'center' }) {
  return (
    <div className={`section-title section-title--${align} ${light ? 'section-title--light' : ''}`}>
      <h2><LeafIcon className="section-title__leaf" size={30} />{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function PageBanner({ title, subtitle, image, crumb }: { title: string; subtitle: string; image: string; crumb: string }) {
  return (
    <>
      <section className="banner" style={{ backgroundImage: `url(${image})` }}>
        <div className="container banner__inner">
          <h1 className="banner__title">{title}</h1>
          <p className="banner__subtitle brush brush--yellow">{subtitle}</p>
        </div>
      </section>
      <div className="container">
        <nav className="breadcrumb" aria-label="Fil d’Ariane">
          <Link to="/">Accueil</Link> <span>›</span> <strong>{crumb}</strong>
        </nav>
      </div>
    </>
  );
}

export function Note({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`note ${className}`}>
      <span>{children}</span>
      <HeartOutline size={26} />
    </div>
  );
}

export function QuantityStepper({ value, onChange, min = 1, max = 200, small = false }: { value: number; onChange: (v: number) => void; min?: number; max?: number; small?: boolean }) {
  return (
    <div className={`stepper ${small ? 'stepper--sm' : ''}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Retirer un">
        <MinusIcon size={16} />
      </button>
      <input
        type="number" inputMode="numeric" min={min} max={max} value={value} aria-label="Quantité"
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
        }}
      />
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Ajouter un">
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

export function Spinner({ label = 'Chargement…' }: { label?: string }) {
  return <div className="spinner" role="status"><span className="spinner__dot" /><span>{label}</span></div>;
}
