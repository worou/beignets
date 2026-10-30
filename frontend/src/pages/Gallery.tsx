import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CloseIcon, HeartOutline } from '../components/Icons';
import { PageBanner } from '../components/Ui';

const PHOTOS = [
  { src: '/images/g1.jpg', alt: 'Bucket de beignets nature' },
  { src: '/images/g2.jpg', alt: 'Beignets dorés en gros plan' },
  { src: '/images/g3.jpg', alt: 'Boules d’ambiance sucrées' },
  { src: '/images/g4.jpg', alt: 'Beignets salés aux herbes' },
  { src: '/images/g5.jpg', alt: 'Beignets salés aux petits oignons' },
  { src: '/images/g6.jpg', alt: 'Beignet fourré coupé en deux' },
  { src: '/images/g7.jpg', alt: 'Bucket Les Beignets de Mamie' },
  { src: '/images/g8.jpg', alt: 'Plaque de beignets tout juste frits' },
  { src: '/images/g9.jpg', alt: 'Beignet fourré au chocolat' },
  { src: '/images/bucket-banane.jpg', alt: 'Bucket bananes' },
  { src: '/images/banane.jpg', alt: 'Beignets bananes' },
  { src: '/images/boules.jpg', alt: 'Bol de boules d’ambiance' },
];

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const go = useCallback((d: number) => setIndex((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length)), []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, go]);

  return (
    <>
      <PageBanner title="Galerie" subtitle="Nos beignets en images" image="/images/g8.jpg" crumb="Galerie" />
      <section className="section section--tight">
        <div className="container">
          <div className="gallery">
            {PHOTOS.map((p, i) => (
              <button key={p.src} className="gallery__item" onClick={() => setIndex(i)} aria-label={`Agrandir : ${p.alt}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
          <p className="gallery__tagline"><span className="brush brush--green">La gourmandise en images !</span> <HeartOutline size={30} /></p>
        </div>
      </section>

      {index !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={PHOTOS[index].alt} onClick={close}>
          <button className="lightbox__btn lightbox__close" onClick={close} aria-label="Fermer"><CloseIcon size={26} /></button>
          <button className="lightbox__btn lightbox__prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Précédente"><ArrowLeft size={26} /></button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[index].src} alt={PHOTOS[index].alt} />
            <figcaption>{PHOTOS[index].alt} · {index + 1}/{PHOTOS.length}</figcaption>
          </figure>
          <button className="lightbox__btn lightbox__next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Suivante"><ArrowRight size={26} /></button>
        </div>
      )}
    </>
  );
}
