import { Link } from 'react-router-dom';
import { CartIcon, TruckIcon } from '../components/Icons';
import { PageBanner, SectionTitle, Spinner } from '../components/Ui';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import type { Product, Variant } from '../api/types';
import { formatPrice } from '../utils/format';

function useAdd() {
  const { add } = useCart();
  return (p: Product, v: Variant, qty = 1) => add({
    variantId: v.id, productSlug: p.slug, productName: p.name, variantLabel: v.label,
    variantDescription: v.description, image: p.image, priceCents: v.priceCents,
  }, qty);
}

export default function Pricing() {
  const { products, loading, config } = useShop();
  const addLine = useAdd();
  const buckets = products.filter((p) => p.kind === 'bucket' && p.category.slug !== 'mixtes');
  const mixte = products.find((p) => p.kind === 'bucket' && p.category.slug === 'mixtes');
  const units = products.filter((p) => p.kind === 'unit');
  const sauces = products.find((p) => p.kind === 'extra');

  return (
    <>
      <PageBanner title="Nos tarifs" subtitle="Des prix gourmands pour tous les plaisirs" image="/images/banner-histoire.jpg" crumb="Tarifs" />
      {loading && <div className="container"><Spinner /></div>}

      <section className="section section--tight">
        <div className="container">
          <SectionTitle title="Les Buckets" subtitle="Plus de beignets, plus de plaisir !" />
          <div className="grid grid--3">
            {buckets.map((p) => (
              <article key={p.id} className="price-card">
                <img src={p.image} alt={p.name} loading="lazy" />
                <h3>{p.name.replace('Bucket ', '')}</h3>
                <table className="price-table">
                  <tbody>
                    {p.variants.filter((v) => v.active).map((v) => (
                      <tr key={v.id}>
                        <th>{v.label}<small>{v.description}</small></th>
                        <td><span className="price-pill price-pill--dark">{formatPrice(v.priceCents)}</span></td>
                        <td><button className="icon-btn icon-btn--sm" onClick={() => addLine(p, v)} aria-label={`Ajouter ${p.name} ${v.label}`}><CartIcon size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
        </div>
      </section>

      {mixte && (
        <section className="section section--tight">
          <div className="container">
            <SectionTitle title="Buckets Mixtes" subtitle="Un assortiment de nos trois spécialités : nature, banane et boules d’ambiance." />
            <div className="grid grid--3">
              {mixte.variants.filter((v) => v.active).map((v, i) => (
                <article key={v.id} className={`mix-card ${i === 1 ? 'mix-card--star' : ''}`}>
                  {i === 1 && <span className="mix-card__ribbon">Le + partagé</span>}
                  <img src={mixte.image} alt="" loading="lazy" />
                  <h3>{v.label}</h3>
                  <p>{v.description}</p>
                  <span className="price-pill">{formatPrice(v.priceCents)}</span>
                  <button className="btn btn--primary btn--sm" onClick={() => addLine(mixte, v)}><CartIcon size={16} /> Ajouter</button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight">
        <div className="container two-cols">
          <div className="card">
            <h2 className="h3">Beignets à l’unité</h2>
            <ul className="unit-list">
              {units.flatMap((p) => p.variants.filter((v) => v.active).map((v) => (
                <li key={v.id}>
                  <Link to={`/produits/${p.slug}`}>{p.name}{p.variants.length > 1 ? ` — ${v.label}` : ''}</Link>
                  <span className="dots" />
                  <strong>{formatPrice(v.priceCents)}</strong>
                </li>
              )))}
            </ul>
          </div>
          <div className="card card--accent">
            <h2 className="h3"><TruckIcon /> Livraison & retrait</h2>
            <ul className="checklist">
              <li>Livraison {config.deliveryArea} : {formatPrice(config.deliveryFeeCents)}</li>
              <li>Livraison offerte dès {formatPrice(config.freeDeliveryThresholdCents)} d’achat</li>
              <li>Minimum de commande : {formatPrice(config.minimumOrderCents)}</li>
              <li>Retrait gratuit sur rendez-vous</li>
              <li>Paiement à la livraison ou au retrait</li>
            </ul>
          </div>
        </div>
      </section>

      {sauces && (
        <section className="container">
          <div className="sauce-band">
            <img src={sauces.image} alt="Sauces maison" loading="lazy" />
            <div>
              <h2>Sauces en supplément</h2>
              <p><strong>{formatPrice(sauces.fromPriceCents ?? 50)}</strong> par sauce — {sauces.variants.map((v) => v.label.replace('Sauce ', '')).join(', ')}.</p>
            </div>
            <Link to="/produits/sauces-maison" className="btn btn--primary">Choisir mes sauces</Link>
          </div>
        </section>
      )}
    </>
  );
}
