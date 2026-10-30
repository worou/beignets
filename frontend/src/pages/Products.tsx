import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { PageBanner, Spinner } from '../components/Ui';
import { useShop } from '../context/ShopContext';
import { LeafIcon } from '../components/Icons';

const KINDS = [
  { value: '', label: 'Tout' },
  { value: 'unit', label: 'À l’unité' },
  { value: 'bucket', label: 'Buckets' },
  { value: 'extra', label: 'Sauces' },
];

export default function Products() {
  const { products, categories, loading, error, reload } = useShop();
  const [params, setParams] = useSearchParams();
  const cat = params.get('categorie') ?? '';
  const kind = params.get('type') ?? '';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
  };

  const usedCategories = useMemo(
    () => categories.filter((c) => products.some((p) => p.category.slug === c.slug && p.kind !== 'extra')),
    [categories, products],
  );
  const list = products.filter((p) => (!cat || p.category.slug === cat) && (!kind || p.kind === kind));

  return (
    <>
      <PageBanner title="Nos produits" subtitle="Des recettes gourmandes pour tous les goûts" image="/images/banner-produits.jpg" crumb="Produits" />
      <section className="section section--tight">
        <div className="container">
          <div className="filters">
            <div className="chips" role="tablist" aria-label="Catégories">
              <button className={`chip ${!cat ? 'is-active' : ''}`} onClick={() => update('categorie', '')}>Tous</button>
              {usedCategories.map((c) => (
                <button key={c.slug} className={`chip ${cat === c.slug ? 'is-active' : ''}`} onClick={() => update('categorie', c.slug)}>
                  {c.name}
                </button>
              ))}
            </div>
            <div className="segmented" role="tablist" aria-label="Type de produit">
              {KINDS.map((k) => (
                <button key={k.value} className={kind === k.value ? 'is-active' : ''} onClick={() => update('type', k.value)}>{k.label}</button>
              ))}
            </div>
          </div>

          {loading && <Spinner />}
          {error && (
            <div className="alert alert--error">
              Impossible de charger le catalogue ({error}). <button className="link" onClick={reload}>Réessayer</button>
            </div>
          )}
          {!loading && !error && list.length === 0 && <p className="empty">Aucun produit dans cette sélection pour le moment.</p>}

          <div className="grid grid--3 products-grid">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <p className="hint"><LeafIcon size={16} /> Les beignets à l’unité s’ajoutent par 5 — ajustez librement la quantité dans le panier.</p>
        </div>
      </section>

      <section className="container">
        <div className="ingredients-band">
          <div>
            <h2>Des ingrédients de qualité</h2>
            <p>Nous sélectionnons avec soin nos ingrédients pour vous garantir des beignets savoureux et authentiques.</p>
          </div>
          <img src="/images/ingredients.jpg" alt="Bananes, farine, épices" loading="lazy" />
        </div>
      </section>
    </>
  );
}
