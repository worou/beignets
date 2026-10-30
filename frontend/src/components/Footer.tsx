import { Link } from 'react-router-dom';
import Logo from './Logo';
import { NAV } from './Header';
import { FacebookIcon, HeartIcon, InstagramIcon, PinIcon, TikTokIcon, WhatsAppIcon } from './Icons';
import { useShop } from '../context/ShopContext';
import { whatsappLink } from '../utils/whatsapp';

export default function Footer() {
  const { config } = useShop();
  return (
    <footer className="footer">
      <div className="container footer__top">
        <Logo light />
        <nav className="footer__nav" aria-label="Liens de pied de page">
          {NAV.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
        </nav>
        <div className="footer__social">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={18} /></a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon /></a>
          <a href={whatsappLink(config.whatsappNumber)} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon size={18} /></a>
        </div>
        <a className="btn btn--whatsapp btn--sm" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie !')} target="_blank" rel="noreferrer">
          <WhatsAppIcon /> Commander sur WhatsApp
        </a>
      </div>
      <div className="container footer__bottom">
        <span><PinIcon size={16} /> {config.deliveryArea}</span>
        <span>© {new Date().getFullYear()} Les Beignets de Mamie. Tous droits réservés. · <Link to="/mentions-legales">Mentions légales</Link></span>
        <span className="footer__motto">Le goût de l’Afrique à chaque bouchée ! <HeartIcon size={14} /></span>
      </div>
      <div className="kente" aria-hidden />
    </footer>
  );
}
