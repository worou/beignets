import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CartIcon, TruckIcon, WhatsAppIcon } from '../components/Icons';
import { ProductCard } from '../components/ProductCard';
import { QuantityStepper, SectionTitle, Spinner } from '../components/Ui';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import { whatsappLink } from '../utils/whatsapp';

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, loading, config } = useShop();
  const { add } = useCart();
  const navigate = useNavigate();
  const product = products.find((p) => p.slug === slug);
  const variants = product?.variants.filter((v) => v.active) ?? [];
  const [variantId, setVariantId] = useState<number | undefined>();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!product) return;
    setVariantId(product.variants.find((v) => v.active)?.id);
    setQty(product.kind === 'unit' ? 10 : 1);
    document.title = `${product.name} — Les Beignets de Mamie`;
    return () => { document.title = 'Les Beignets de Mamie — Le goût authentique de l’Afrique'; };
  }, [product]);

  if (loading) return <div className="container section"><Spinner /></div>;
  if (!product) {
    return (
      <div className="container section center">
        <h1 className="h2">Produit introuvable</h1>
        <Link to="/produits" className="btn btn--primary">Retour aux produits</Link>
      </div>
    );
  }

  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const related = products.filter((p) => p.id !== product.id && p.kind !== 'extra' && (p.category.slug === product.category.slug || p.kind === product.kind)).slice(0, 3);

  const onAdd = (goToCart = false) => {
    if (!variant) return;
    add({
      variantId: variant.id, productSlug: product.slug, productName: product.name, variantLabel: variant.label,
      variantDescription: variant.description, image: product.image, priceCents: variant.priceCents,
    }, qty);
    if (goToCart) navigate('/panier');
  };

  return (
    <>
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Accueil</Link> <span>›</span> <Link to="/produits">Produits</Link> <span>›</span> <strong>{product.name}</strong>
        </nav>
      </div>
      <section className="section section--tight">
        <div className="container detail">
          <div className="detail__media">
            <img src={product.image} alt={product.name} />
            <span className={`detail__cat brush brush--${product.category.color}`}>{product.category.name}</span>
          </div>
          <div className="detail__info">
            <button className="link back" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Retour</button>
            <h1 className="detail__title">{product.name}</h1>
            <p className="detail__short">{product.shortDescription}</p>
            {product.description && <p>{product.description}</p>}

            <fieldset className="variants">
              <legend>Choisissez votre format</legend>
              {variants.map((v) => (
                <label key={v.id} className={`variant ${v.id === variant?.id ? 'is-active' : ''}`}>
                  <input type="radio" name="variant" checked={v.id === variant?.id} onChange={() => setVariantId(v.id)} />
                  <span className="variant__label">{v.label}<small>{v.description}</small></span>
                  <span className="variant__price">{formatPrice(v.priceCents)}</span>
                </label>
              ))}
            </fieldset>

            <div className="detail__buy">
              <QuantityStepper value={qty} onChange={setQty} />
              <span className="detail__total">{variant ? formatPrice(variant.priceCents * qty) : ''}</span>
            </div>
            <div className="detail__ctas">
              <button className="btn btn--primary btn--lg" onClick={() => onAdd(false)}><CartIcon size={18} /> Ajouter au panier</button>
              <button className="btn btn--outline btn--lg" onClick={() => onAdd(true)}>Commander</button>
            </div>
            <ul className="detail__perks">
              <li><TruckIcon size={18} /> Livraison {config.deliveryArea} · offerte dès {formatPrice(config.freeDeliveryThresholdCents)}</li>
              <li>
                <WhatsAppIcon size={18} /> Une question ?{' '}
                <a href={whatsappLink(config.whatsappNumber, `Bonjour Mamie, j’ai une question sur « ${product.name} »`)} target="_blank" rel="noreferrer">Écrivez à Mamie</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <SectionTitle title="Vous aimerez aussi" />
            <div className="grid grid--3">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}
