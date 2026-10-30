import { AfricaIcon, HeartIcon, LeafIcon, TruckIcon, WhatsAppIcon } from './Icons';

const FEATURES = [
  { icon: <LeafIcon size={24} />, cls: 'green', text: <>Ingrédients<br />de qualité</> },
  { icon: <HeartIcon size={24} />, cls: 'orange', text: <>Recettes<br />traditionnelles</> },
  { icon: <AfricaIcon size={26} />, cls: 'brown', text: <>Saveurs<br />d’Afrique</> },
  { icon: <TruckIcon size={24} />, cls: 'green', text: <>Livraison possible<br /><small>(Paris et IDF)</small></> },
  { icon: <WhatsAppIcon size={24} />, cls: 'green', text: <>Commande facile<br /><small>sur WhatsApp</small></> },
];

export default function FeatureBar() {
  return (
    <section className="features" aria-label="Nos engagements">
      <div className="container features__grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="feature">
            <span className={`feature__icon feature__icon--${f.cls}`}>{f.icon}</span>
            <span className="feature__text">{f.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
