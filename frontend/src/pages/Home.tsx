import { Link } from 'react-router-dom';
import FeatureBar from '../components/FeatureBar';
import { ArrowRight, HeartOutline, WhatsAppIcon } from '../components/Icons';
import { BucketCard, SpecialtyCard } from '../components/ProductCard';
import { Note, SectionTitle, Spinner } from '../components/Ui';
import { useShop } from '../context/ShopContext';
import { whatsappLink } from '../utils/whatsapp';

const REVIEWS = [
  { name: 'Aïcha', city: 'Montreuil', text: 'Les beignets bananes sont incroyables, on se croirait chez ma grand-mère à Abidjan.' },
  { name: 'Julien', city: 'Paris 11e', text: 'Commandé un Bucket Mixte Partage pour un anniversaire : tout le monde a adoré !' },
  { name: 'Fatou', city: 'Saint-Denis', text: 'Livraison à l’heure, beignets encore tièdes et moelleux. Je recommande les yeux fermés.' },
];

export default function Home() {
  const { products, loading, error, config } = useShop();
  const specialties = products.filter((p) => p.kind === 'unit' && p.featured).slice(0, 4);
  const buckets = products.filter((p) => p.kind === 'bucket').slice(0, 4);

  return (
    <>
      {/* ——— Hero ——— */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <h1 className="hero__title">
              <span className="hero__l1">Des beignets</span>
              <span className="hero__l2">pleins de saveurs !</span>
              <HeartOutline className="hero__heart" size={38} />
            </h1>
            <p className="hero__lead">
              Nature, banane, boules d’ambiance… Découvrez nos recettes traditionnelles,
              préparées avec amour et des ingrédients de qualité.
            </p>
            <div className="hero__ctas">
              <Link to="/produits" className="btn btn--primary btn--lg">Commander maintenant <ArrowRight size={18} /></Link>
              <a className="btn btn--ghost btn--lg" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie ! Je souhaite commander des beignets 😊')} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> Via WhatsApp
              </a>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__blob" aria-hidden />
            <img src="/images/hero-bucket.jpg" alt="Bucket de beignets dorés Les Beignets de Mamie" className="hero__img" />
            <Note className="hero__note">Un vrai moment de gourmandise !</Note>
          </div>
        </div>
      </section>

      <FeatureBar />

      {/* ——— Les mots de Mamie ——— */}
      <section className="section mamie">
        <div className="container mamie__grid">
          <div className="mamie__photo">
            <img src="/images/mamie.jpg" alt="Mamie, souriante, tenant un plat de beignets" loading="lazy" />
          </div>
          <div className="mamie__letter">
            <SectionTitle title="Les mots de Mamie" />
            <div className="handwritten">
              <p>Bonjour mes chers gourmands,</p>
              <p>
                Je suis Mamie, la cuisinière de cœur de Les Beignets de Mamie ! Depuis toujours, je prépare ces beignets
                avec amour, comme le faisait ma grand-mère. Chaque bouchée est une invitation au voyage, un petit morceau
                d’Afrique dans votre assiette.
              </p>
              <p>Ici, pas de secret : juste des ingrédients simples, de la bonne humeur et beaucoup d’amour !</p>
              <p>Merci de faire partie de cette belle aventure. Bon appétit !</p>
              <p className="signature">Mamie <HeartOutline size={22} /></p>
            </div>
          </div>
          <div className="mamie__badge brush brush--green">Le goût authentique de l’Afrique</div>
        </div>
      </section>

      {/* ——— Spécialités ——— */}
      <section className="section">
        <div className="container">
          <SectionTitle title="Nos Spécialités" subtitle="Trois recettes, mille saveurs !" />
          {loading && <Spinner />}
          {error && <p className="alert alert--error">Le catalogue est momentanément indisponible. {error}</p>}
          <div className="grid grid--4">
            {specialties.map((p) => <SpecialtyCard key={p.id} product={p} />)}
          </div>
          <div className="center mt-l">
            <Link to="/produits" className="btn btn--outline">Voir tous nos beignets <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* ——— Buckets ——— */}
      <section className="section section--tint">
        <div className="container buckets">
          <div>
            <SectionTitle title="Nos Buckets" subtitle="Plus de beignets, plus de plaisir !" />
            <div className="grid grid--4">
              {buckets.map((p) => <BucketCard key={p.id} product={p} />)}
            </div>
          </div>
          <Note className="buckets__note">Des buckets pour toutes les occasions !</Note>
        </div>
      </section>

      {/* ——— Avis ——— */}
      <section className="section">
        <div className="container">
          <SectionTitle title="Ils ont goûté" subtitle="Les mots doux de nos clients" />
          <div className="grid grid--3">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="review">
                <div className="review__stars" aria-label="5 étoiles sur 5">★★★★★</div>
                <blockquote>« {r.text} »</blockquote>
                <figcaption><strong>{r.name}</strong> · {r.city}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-band">
        <div className="container cta-band__inner">
          <img src="/images/partage.jpg" alt="" className="cta-band__img" loading="lazy" />
          <div>
            <h2>Un moment de partage et de gourmandise !</h2>
            <p>Anniversaire, baptême, réunion de famille ou simple envie : Mamie prépare votre commande à la demande.</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/tarifs" className="btn btn--light">Voir les tarifs</Link>
            <a className="btn btn--whatsapp" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie ! J’ai une commande pour un événement 🎉')} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> Une commande spéciale ?
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
