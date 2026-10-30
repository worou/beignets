import { Link } from 'react-router-dom';
import { ArrowRight, FamilyIcon, HeartIcon, LeafIcon, SproutIcon, BowlIcon } from '../components/Icons';
import { PageBanner } from '../components/Ui';

const VALUES = [
  { icon: <FamilyIcon size={30} />, title: 'Tradition familiale', text: 'Une recette transmise de génération en génération.' },
  { icon: <BowlIcon size={30} />, title: 'Recettes authentiques', text: 'Les gestes et les saveurs d’origine, sans raccourci.' },
  { icon: <SproutIcon size={30} />, title: 'Produits frais', text: 'Farine, bananes mûres, épices : sélectionnés avec soin.' },
  { icon: <HeartIcon size={28} />, title: 'Fait avec amour', text: 'Chaque fournée est préparée à la main, à la commande.' },
];

export default function Story() {
  return (
    <>
      <PageBanner title="Notre histoire" subtitle="Une recette, une tradition, une passion" image="/images/banner-histoire.jpg" crumb="Notre histoire" />

      <section className="section">
        <div className="container split">
          <img className="split__img split__img--portrait" src="/images/mamie-hero.jpg" alt="Mamie et son bucket de beignets" />
          <div>
            <h2 className="h2">Une histoire de famille</h2>
            <p className="lead">
              Les Beignets de Mamie est né d’un héritage culinaire : celui de notre grand-mère, qui préparait ces beignets
              avec amour pour sa famille et ses proches.
            </p>
            <p>
              Aujourd’hui, nous perpétuons cette tradition en vous offrant des beignets authentiques, préparés avec les mêmes
              valeurs : qualité, partage et convivialité. Des marchés d’Afrique de l’Ouest aux tables d’Île-de-France,
              la recette n’a pas changé — seulement le nombre de gourmands !
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container grid grid--4 values">
          {VALUES.map((v) => (
            <div key={v.title} className="value">
              <span className="value__icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container">
        <blockquote className="quote-band">
          <LeafIcon size={34} />
          “Chaque beignet raconte une histoire… celle de notre famille et de notre Afrique.”
          <HeartIcon size={26} />
        </blockquote>
      </section>

      <section className="section">
        <div className="container split split--reverse">
          <img className="split__img" src="/images/engagement.jpg" alt="Beignets servis avec un thé" loading="lazy" />
          <div>
            <h2 className="h2">Notre engagement</h2>
            <p>
              Nous nous engageons à vous offrir des produits savoureux, frais et de qualité, tout en soutenant les
              producteurs locaux et en valorisant le savoir-faire africain.
            </p>
            <ul className="checklist">
              <li>Préparation du jour, jamais de surgelé</li>
              <li>Ingrédients simples, sans conservateurs</li>
              <li>Emballages recyclables aux couleurs de Mamie</li>
            </ul>
            <Link to="/produits" className="btn btn--primary">Goûter nos beignets <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
