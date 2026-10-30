import { useState, type FormEvent } from 'react';
import { api, ApiError } from '../api/client';
import { ArrowRight, CheckIcon, ClockIcon, FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, TikTokIcon, WhatsAppIcon } from '../components/Icons';
import { PageBanner } from '../components/Ui';
import { useShop } from '../context/ShopContext';
import { whatsappLink } from '../utils/whatsapp';

const EMPTY = { name: '', email: '', phone: '', message: '' };

export default function Contact() {
  const { config } = useShop();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [globalError, setGlobalError] = useState('');
  const phoneDisplay = `+${config.whatsappNumber}`.replace(/^\+33(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/, '+33 $1 $2 $3 $4 $5');

  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    try {
      await api.sendContact({ ...form, phone: form.phone || undefined });
      setStatus('sent');
      setForm(EMPTY);
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        setErrors(err.violations);
        setGlobalError(Object.keys(err.violations).length ? '' : err.message);
      }
    }
  };

  return (
    <>
      <PageBanner title="Contactez-nous" subtitle="Une question ? Une commande ?" image="/images/banner-contact.jpg" crumb="Contact" />
      <section className="section section--tight">
        <div className="container contact">
          <div>
            <h2 className="h3">Nos coordonnées</h2>
            <ul className="coords">
              <li><span className="coords__icon"><PhoneIcon /></span><div><strong>Téléphone</strong><a href={`tel:+${config.whatsappNumber}`}>{phoneDisplay}</a><small>(WhatsApp de préférence)</small></div></li>
              <li><span className="coords__icon"><MailIcon /></span><div><strong>E-mail</strong><a href="mailto:contact@lesbeignetsdemamie.fr">contact@lesbeignetsdemamie.fr</a></div></li>
              <li><span className="coords__icon"><PinIcon /></span><div><strong>Zone de livraison</strong><span>{config.deliveryArea}</span></div></li>
              <li><span className="coords__icon"><ClockIcon /></span><div><strong>Horaires</strong><span>Lundi – Samedi : 9h – 20h</span><span>Dimanche : 10h – 18h</span></div></li>
            </ul>
            <h3 className="h4">Suivez-nous</h3>
            <div className="socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={20} /></a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokIcon size={20} /></a>
              <a href={whatsappLink(config.whatsappNumber)} target="_blank" rel="noreferrer" aria-label="WhatsApp"><WhatsAppIcon size={20} /></a>
            </div>
          </div>

          <div className="contact__right">
            <form className="card form" onSubmit={onSubmit} noValidate>
              <h2 className="h3">Envoyez-nous un message</h2>
              {status === 'sent' && <p className="alert alert--success"><CheckIcon size={18} /> Merci ! Mamie vous répond très vite.</p>}
              {globalError && <p className="alert alert--error">{globalError}</p>}
              <div className="form__row">
                <Field label="Nom *" error={errors.name}><input value={form.name} onChange={set('name')} autoComplete="name" required /></Field>
                <Field label="Téléphone" error={errors.phone}><input value={form.phone} onChange={set('phone')} autoComplete="tel" type="tel" /></Field>
              </div>
              <Field label="E-mail *" error={errors.email}><input value={form.email} onChange={set('email')} autoComplete="email" type="email" required /></Field>
              <Field label="Votre message *" error={errors.message}><textarea rows={5} value={form.message} onChange={set('message')} required /></Field>
              <button className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Envoi…' : <>Envoyer <ArrowRight size={18} /></>}
              </button>
            </form>
            <a className="wa-card" href={whatsappLink(config.whatsappNumber, 'Bonjour Mamie ! Je souhaite passer commande 😊')} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={44} />
              <div><strong>Commandez facilement sur WhatsApp</strong><span>Cliquez ici pour envoyer votre commande directement à Mamie.</span></div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export function Field({ label, error, children, hint }: { label: string; error?: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}
