import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import { CheckIcon, CloseIcon, WhatsAppIcon } from './Icons';
import { whatsappLink } from '../utils/whatsapp';

function CartToast() {
  const { lastAdded, dismissLastAdded, subtotalCents, count } = useCart();
  useEffect(() => {
    if (!lastAdded) return;
    const t = window.setTimeout(dismissLastAdded, 3500);
    return () => window.clearTimeout(t);
  }, [lastAdded, dismissLastAdded]);
  if (!lastAdded) return null;
  return (
    <div className="toast" role="status">
      <img src={lastAdded.image} alt="" />
      <div>
        <strong><CheckIcon size={16} /> Ajouté au panier</strong>
        <span>{lastAdded.quantity} × {lastAdded.productName} — {lastAdded.variantLabel}</span>
        <span className="toast__sum">{count} article{count > 1 ? 's' : ''} · {formatPrice(subtotalCents)}</span>
      </div>
      <Link to="/panier" className="btn btn--primary btn--sm" onClick={dismissLastAdded}>Voir le panier</Link>
      <button className="toast__close" onClick={dismissLastAdded} aria-label="Fermer"><CloseIcon size={16} /></button>
    </div>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const { config } = useShop();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <CartToast />
      <a className="wa-float" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie ! 😊')} target="_blank" rel="noreferrer" aria-label="Écrire sur WhatsApp">
        <WhatsAppIcon size={30} />
      </a>
    </>
  );
}
