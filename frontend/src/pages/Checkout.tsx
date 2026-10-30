import { useMemo, useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api, ApiError, variantIri } from '../api/client';
import type { Fulfilment } from '../api/types';
import { ArrowRight, StoreIcon, TruckIcon } from '../components/Icons';
import { useCart } from '../context/CartContext';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import { Field } from './Contact';

const todayIso = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

export default function Checkout() {
  const { lines, subtotalCents, clear } = useCart();
  const { config } = useShop();
  const navigate = useNavigate();
  const [f, setF] = useState({
    customerName: '', email: '', phone: '', fulfilment: 'delivery' as Fulfilment,
    address: '', postalCode: '', city: '', requestedDate: '', timeSlot: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [sending, setSending] = useState(false);

  const fee = useMemo(() => (f.fulfilment === 'pickup' || subtotalCents >= config.freeDeliveryThresholdCents ? 0 : config.deliveryFeeCents),
    [f.fulfilment, subtotalCents, config]);

  if (!lines.length) return <Navigate to="/panier" replace />;

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.customerName.trim()) e.customerName = 'Merci d’indiquer votre nom.';
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Cette adresse e-mail n’est pas valide.';
    if (!/^\+?[0-9 .\-()]{9,20}$/.test(f.phone)) e.phone = 'Ce numéro de téléphone n’est pas valide.';
    if (f.fulfilment === 'delivery') {
      if (!f.address.trim()) e.address = 'Merci d’indiquer l’adresse de livraison.';
      if (!f.city.trim()) e.city = 'Merci d’indiquer la ville.';
      if (!new RegExp(`^(${config.deliveryPostalPrefixes.join('|')})\\d{3}$`).test(f.postalCode.trim())) {
        e.postalCode = 'Nous livrons uniquement Paris et l’Île-de-France.';
      }
    }
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setGlobalError('');
    if (Object.keys(e).length) {
      document.querySelector('.field--error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSending(true);
    try {
      const delivery = f.fulfilment === 'delivery';
      const order = await api.createOrder({
        customerName: f.customerName, email: f.email, phone: f.phone, fulfilment: f.fulfilment,
        address: delivery ? f.address : undefined, postalCode: delivery ? f.postalCode.trim() : undefined, city: delivery ? f.city : undefined,
        requestedDate: f.requestedDate || null, timeSlot: f.timeSlot || undefined, notes: f.notes || undefined,
        items: lines.map((l) => ({ variant: variantIri(l.variantId), quantity: l.quantity })),
      });
      clear();
      navigate(`/commande/${order.id}`, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.violations);
        setGlobalError(err.violations.items ?? (Object.keys(err.violations).length ? 'Merci de corriger les champs indiqués.' : err.message));
      } else {
        setGlobalError('Une erreur est survenue. Réessayez ou commandez sur WhatsApp.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="section section--tight">
      <div className="container">
        <nav className="breadcrumb"><Link to="/panier">Panier</Link> <span>›</span> <strong>Finaliser ma commande</strong></nav>
        <h1 className="page-title">Finaliser ma commande</h1>
        <form className="checkout-grid" onSubmit={onSubmit} noValidate>
          <div className="stack">
            <fieldset className="card form">
              <legend className="h4">1. Vos coordonnées</legend>
              <Field label="Nom et prénom *" error={errors.customerName}><input value={f.customerName} onChange={set('customerName')} autoComplete="name" /></Field>
              <div className="form__row">
                <Field label="E-mail *" error={errors.email}><input type="email" value={f.email} onChange={set('email')} autoComplete="email" /></Field>
                <Field label="Téléphone *" error={errors.phone} hint="Mamie vous confirme la commande par WhatsApp ou SMS."><input type="tel" value={f.phone} onChange={set('phone')} autoComplete="tel" /></Field>
              </div>
            </fieldset>

            <fieldset className="card form">
              <legend className="h4">2. Livraison ou retrait</legend>
              <div className="mode-toggle">
                <label className={f.fulfilment === 'delivery' ? 'is-active' : ''}>
                  <input type="radio" name="fulfilment" checked={f.fulfilment === 'delivery'} onChange={() => setF((s) => ({ ...s, fulfilment: 'delivery' }))} />
                  <TruckIcon /> <span><strong>Livraison</strong><small>{config.deliveryArea} · {subtotalCents >= config.freeDeliveryThresholdCents ? 'offerte' : formatPrice(config.deliveryFeeCents)}</small></span>
                </label>
                <label className={f.fulfilment === 'pickup' ? 'is-active' : ''}>
                  <input type="radio" name="fulfilment" checked={f.fulfilment === 'pickup'} onChange={() => setF((s) => ({ ...s, fulfilment: 'pickup' }))} />
                  <StoreIcon /> <span><strong>Retrait</strong><small>Gratuit · adresse envoyée à la confirmation</small></span>
                </label>
              </div>
              {f.fulfilment === 'delivery' && (
                <>
                  <Field label="Adresse *" error={errors.address}><input value={f.address} onChange={set('address')} autoComplete="street-address" placeholder="N° et rue, bâtiment, étage…" /></Field>
                  <div className="form__row form__row--zip">
                    <Field label="Code postal *" error={errors.postalCode}><input value={f.postalCode} onChange={set('postalCode')} autoComplete="postal-code" inputMode="numeric" maxLength={5} /></Field>
                    <Field label="Ville *" error={errors.city}><input value={f.city} onChange={set('city')} autoComplete="address-level2" /></Field>
                  </div>
                </>
              )}
              <div className="form__row">
                <Field label="Date souhaitée" error={errors.requestedDate}><input type="date" min={todayIso()} value={f.requestedDate} onChange={set('requestedDate')} /></Field>
                <Field label="Créneau" error={errors.timeSlot}>
                  <select value={f.timeSlot} onChange={set('timeSlot')}>
                    <option value="">Indifférent</option>
                    {config.timeSlots.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Précisions (allergies, digicode, occasion…)" error={errors.notes}><textarea rows={3} value={f.notes} onChange={set('notes')} /></Field>
            </fieldset>
          </div>

          <aside className="card summary">
            <h2 className="h3">Votre commande</h2>
            <ul className="mini-lines">
              {lines.map((l) => (
                <li key={l.variantId}>
                  <img src={l.image} alt="" />
                  <span><strong>{l.quantity} × {l.productName}</strong><small>{l.variantLabel}</small></span>
                  <span>{formatPrice(l.priceCents * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="summary__rows">
              <div><dt>Sous-total</dt><dd>{formatPrice(subtotalCents)}</dd></div>
              <div><dt>{f.fulfilment === 'pickup' ? 'Retrait' : 'Livraison'}</dt><dd>{fee ? formatPrice(fee) : 'Offert'}</dd></div>
              <div className="summary__total"><dt>Total</dt><dd>{formatPrice(subtotalCents + fee)}</dd></div>
            </dl>
            {globalError && <p className="alert alert--error">{globalError}</p>}
            <button className="btn btn--primary btn--lg btn--block" disabled={sending}>
              {sending ? 'Envoi en cours…' : <>Confirmer la commande <ArrowRight size={18} /></>}
            </button>
            <p className="muted small center">Paiement à la livraison ou au retrait (espèces, CB, Lydia/Wero).</p>
          </aside>
        </form>
      </div>
    </section>
  );
}
