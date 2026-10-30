import { Link } from 'react-router-dom';
import { ChefHat } from '../components/Logo';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty-cart">
        <span className="empty-cart__icon"><ChefHat size={72} /></span>
        <h1 className="h2">Oups, cette page s’est envolée…</h1>
        <p>Comme les beignets de Mamie, elle n’a pas fait long feu !</p>
        <Link to="/" className="btn btn--primary btn--lg">Retour à l’accueil</Link>
      </div>
    </section>
  );
}
