import { Link } from 'react-router-dom';
import { ArrowRight, CartIcon, TrashIcon, TruckIcon, WhatsAppIcon } from '../components/Icons';
import { QuantityStepper } from '../components/Ui';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import { cartMessage, whatsappLink } from '../utils/whatsapp';

export default function Cart() {
  const { lines, setQuantity, remove, subtotalCents, count } = useCart();
  const { config } = useShop();
  const remainingFree = Math.max(0, config.freeDeliveryThresholdCents - subtotalCents);
  const fee = remainingFree > 0 ? config.deliveryFeeCents : 0;
  const belowMin = subtotalCents < config.minimumOrderCents;
  const progress = Math.min(100, (subtotalCents / config.freeDeliveryThresholdCents) * 100);

  if (!lines.length) {
    return (
      <section className="section">
        <div className="container empty-cart">
          <span className="empty-cart__icon"><CartIcon size={48} /></span>
          <h1 className="h2">Votre panier est vide</h1>
          <p>Laissez-vous tenter par les spécialités de Mamie !</p>
          <Link to="/produits" className="btn btn--primary btn--lg">Découvrir nos beignets <ArrowRight size={18} /></Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--tight">
      <div className="container">
        <h1 className="page-title">Mon panier <small>({count} article{count > 1 ? 's' : ''})</small></h1>
        <div className="checkout-grid">
          <div className="card cart-lines">
            {lines.map((l) => (
              <div key={l.variantId} className="cart-line">
                <Link to={`/produits/${l.productSlug}`} className="cart-line__img"><img src={l.image} alt="" /></Link>
                <div className="cart-line__info">
                  <Link to={`/produits/${l.productSlug}`}><strong>{l.productName}</strong></Link>
                  <span>{l.variantLabel}{l.variantDescription ? ` · ${l.variantDescription}` : ''}</span>
                  <span className="muted">{formatPrice(l.priceCents)} l’unité</span>
                </div>
                <QuantityStepper small value={l.quantity} onChange={(v) => setQuantity(l.variantId, v)} />
                <strong className="cart-line__total">{formatPrice(l.priceCents * l.quantity)}</strong>
                <button className="icon-btn icon-btn--ghost" onClick={() => remove(l.variantId)} aria-label={`Retirer ${l.productName}`}><TrashIcon size={18} /></button>
              </div>
            ))}
            <Link to="/produits" className="link">← Continuer mes achats</Link>
          </div>

          <aside className="card summary">
            <h2 className="h3">Récapitulatif</h2>
            <div className="free-ship">
              <TruckIcon size={18} />
              {remainingFree > 0
                ? <span>Plus que <strong>{formatPrice(remainingFree)}</strong> pour la livraison offerte</span>
                : <span><strong>Livraison offerte</strong> 🎉</span>}
              <div className="progress"><span style={{ width: `${progress}%` }} /></div>
            </div>
            <dl className="summary__rows">
              <div><dt>Sous-total</dt><dd>{formatPrice(subtotalCents)}</dd></div>
              <div><dt>Livraison (estimée)</dt><dd>{fee ? formatPrice(fee) : 'Offerte'}</dd></div>
              <div className="summary__total"><dt>Total</dt><dd>{formatPrice(subtotalCents + fee)}</dd></div>
            </dl>
            {belowMin && <p className="alert alert--warn">Minimum de commande : {formatPrice(config.minimumOrderCents)}.</p>}
            <Link to="/commande" className={`btn btn--primary btn--lg btn--block ${belowMin ? 'is-disabled' : ''}`} aria-disabled={belowMin}
              onClick={(e) => belowMin && e.preventDefault()}>
              Valider ma commande <ArrowRight size={18} />
            </Link>
            <div className="or"><span>ou</span></div>
            <a className="btn btn--whatsapp btn--block" href={whatsappLink(config.whatsappNumber, cartMessage(lines, subtotalCents))} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Envoyer mon panier sur WhatsApp
            </a>
            <p className="muted small center">Paiement à la livraison ou au retrait.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
