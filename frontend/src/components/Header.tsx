import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { CartIcon, CloseIcon, MenuIcon, WhatsAppIcon } from './Icons';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { whatsappLink } from '../utils/whatsapp';

export const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/notre-histoire', label: 'Notre histoire' },
  { to: '/produits', label: 'Produits' },
  { to: '/tarifs', label: 'Tarifs' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { count } = useCart();
  const { config } = useShop();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Logo />
        <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navigation principale">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav__link">
              {item.label}
            </NavLink>
          ))}
          <a className="btn btn--whatsapp nav__wa-mobile" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie ! Je souhaite passer commande 😊')} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Commander sur WhatsApp
          </a>
        </nav>
        <div className="header__actions">
          <a className="btn btn--whatsapp header__wa" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie ! Je souhaite passer commande 😊')} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> <span>Commander sur WhatsApp</span>
          </a>
          <Link to="/panier" className="cart-btn" aria-label={`Panier (${count} article${count > 1 ? 's' : ''})`}>
            <CartIcon size={26} />
            <span className={`cart-btn__badge ${count ? 'is-filled' : ''}`}>{count}</span>
          </Link>
          <button className="burger" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open}>
            {open ? <CloseIcon size={26} /> : <MenuIcon size={26} />}
          </button>
        </div>
      </div>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </header>
  );
}
