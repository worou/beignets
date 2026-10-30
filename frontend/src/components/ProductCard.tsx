import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../api/types';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { ArrowRight, CartIcon, CheckIcon } from './Icons';

/** Carte « spécialité » de la page d’accueil (bandeau coloré façon pinceau). */
export function SpecialtyCard({ product }: { product: Product }) {
  return (
    <Link to={`/produits/${product.slug}`} className="specialty">
      <div className="specialty__img"><img src={product.image} alt={product.name} loading="lazy" /></div>
      <h3 className={`specialty__label brush brush--${product.category.color}`}>{product.name}</h3>
      <div className="specialty__foot">
        <span>{product.shortDescription}</span>
        <span className="round-arrow"><ArrowRight size={16} /></span>
      </div>
    </Link>
  );
}

/** Carte bucket : « À partir de … ». */
export function BucketCard({ product }: { product: Product }) {
  return (
    <Link to={`/produits/${product.slug}`} className="bucket">
      <div className="bucket__img"><img src={product.image} alt={product.name} loading="lazy" /></div>
      <h3>{product.name}</h3>
      <p className="bucket__sizes">
        {product.variants.map((v) => {
          const short = v.description?.replace(/ beignets| boules| offert(e)?s/g, '') ?? '';
          return short.length <= 8 ? short : `${v.pieces} pièces`;
        }).join(' / ')}
      </p>
      {product.fromPriceCents !== null && (
        <span className="price-pill"><small>À partir de</small> {formatPrice(product.fromPriceCents)}</span>
      )}
    </Link>
  );
}

/** Carte catalogue avec ajout rapide au panier. */
export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const variants = product.variants.filter((v) => v.active);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [added, setAdded] = useState(false);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const isUnit = product.kind === 'unit';
  const step = isUnit ? 5 : 1;

  const onAdd = () => {
    if (!variant) return;
    add({
      variantId: variant.id, productSlug: product.slug, productName: product.name,
      variantLabel: variant.label, variantDescription: variant.description, image: product.image, priceCents: variant.priceCents,
    }, step);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="pcard">
      <Link to={`/produits/${product.slug}`} className="pcard__img">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.kind === 'bucket' && <span className="pcard__tag">Bucket</span>}
      </Link>
      <div className="pcard__body">
        <h3><Link to={`/produits/${product.slug}`}>{product.name}</Link></h3>
        <p className="pcard__desc">{product.shortDescription}</p>
        {variants.length > 1 && (
          <div className="chips chips--sm" role="radiogroup" aria-label="Format">
            {variants.map((v) => (
              <button key={v.id} type="button" role="radio" aria-checked={v.id === variant?.id}
                className={`chip ${v.id === variant?.id ? 'is-active' : ''}`} onClick={() => setVariantId(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        )}
        <div className="pcard__foot">
          {variant && (
            <span className="price-pill price-pill--dark">
              {formatPrice(variant.priceCents)} <small>{product.unitLabel}</small>
            </span>
          )}
          <button type="button" className={`icon-btn ${added ? 'is-done' : ''}`} onClick={onAdd}
            aria-label={`Ajouter ${isUnit ? '5 ' : ''}${product.name} au panier`} title={isUnit ? 'Ajouter 5 pièces' : 'Ajouter au panier'}>
            {added ? <CheckIcon size={18} /> : <CartIcon size={18} />}
          </button>
        </div>
        {variant?.description && variants.length > 1 && <p className="pcard__variant">{variant.description}</p>}
      </div>
    </article>
  );
}
