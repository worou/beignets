import { Fragment, useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { api, ApiError } from '../../api/client';
import type { ContactMessage, Order, OrderStatus, Product, Variant } from '../../api/types';
import { Field } from '../Contact';
import { Spinner } from '../../components/Ui';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { formatDate, formatPrice, STATUS_LABELS } from '../../utils/format';
import { whatsappLink } from '../../utils/whatsapp';
import { WhatsAppIcon } from '../../components/Icons';

type Tab = 'orders' | 'products' | 'messages';
const STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];

export default function AdminDashboard() {
  const { isAdmin, logout, email } = useAuth();
  const [tab, setTab] = useState<Tab>('orders');
  if (!isAdmin) return <Navigate to="/admin/connexion" replace />;

  return (
    <section className="section section--tight admin">
      <div className="container">
        <div className="admin__head">
          <div>
            <h1 className="page-title">Espace Mamie</h1>
            <p className="muted">Connectée en tant que {email}</p>
          </div>
          <button className="btn btn--outline btn--sm" onClick={logout}>Se déconnecter</button>
        </div>
        <div className="segmented admin__tabs">
          <button className={tab === 'orders' ? 'is-active' : ''} onClick={() => setTab('orders')}>Commandes</button>
          <button className={tab === 'products' ? 'is-active' : ''} onClick={() => setTab('products')}>Produits & prix</button>
          <button className={tab === 'messages' ? 'is-active' : ''} onClick={() => setTab('messages')}>Messages</button>
        </div>
        {tab === 'orders' && <OrdersPanel onAuthError={logout} />}
        {tab === 'products' && <ProductsPanel onAuthError={logout} />}
        {tab === 'messages' && <MessagesPanel onAuthError={logout} />}
      </div>
    </section>
  );
}

function useAuthGuard(onAuthError: () => void) {
  return useCallback((e: unknown) => {
    if (e instanceof ApiError && (e.status === 401 || e.status === 403)) onAuthError();
    return e instanceof Error ? e.message : 'Erreur';
  }, [onAuthError]);
}

function OrdersPanel({ onAuthError }: { onAuthError: () => void }) {
  const guard = useAuthGuard(onAuthError);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(() => {
    setOrders(null);
    api.adminOrders(filter).then(setOrders).catch((e) => setError(guard(e)));
  }, [filter, guard]);
  useEffect(load, [load]);

  const stats = useMemo(() => {
    const list = orders ?? [];
    const today = new Date().toDateString();
    return {
      today: list.filter((o) => new Date(o.createdAt).toDateString() === today).length,
      pending: list.filter((o) => o.status === 'pending').length,
      revenue: list.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalCents, 0),
    };
  }, [orders]);

  const changeStatus = async (o: Order, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(o.id, status);
      setOrders((list) => list?.map((x) => (x.id === o.id ? updated : x)) ?? null);
    } catch (e) { setError(guard(e)); }
  };

  return (
    <>
      <div className="stats">
        <div className="stat"><span>Commandes du jour</span><strong>{stats.today}</strong></div>
        <div className="stat"><span>À confirmer</span><strong>{stats.pending}</strong></div>
        <div className="stat"><span>Chiffre d’affaires (liste)</span><strong>{formatPrice(stats.revenue)}</strong></div>
      </div>
      <div className="admin__toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrer par statut">
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <button className="btn btn--outline btn--sm" onClick={load}>Actualiser</button>
      </div>
      {error && <p className="alert alert--error">{error}</p>}
      {!orders ? <Spinner /> : orders.length === 0 ? <p className="empty">Aucune commande.</p> : (
        <div className="card table-wrap">
          <table className="admin-table">
            <thead><tr><th>Réf.</th><th>Date</th><th>Client</th><th>Mode</th><th>Total</th><th>Statut</th><th /></tr></thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <tr>
                    <td><button className="link" onClick={() => setOpen(open === o.id ? null : o.id)}>{o.reference}</button></td>
                    <td>{formatDate(o.createdAt, true)}</td>
                    <td>{o.customerName}<small>{o.phone}</small></td>
                    <td>{o.fulfilment === 'delivery' ? `Livraison ${o.postalCode ?? ''}` : 'Retrait'}<small>{o.requestedDate ? formatDate(o.requestedDate) : 'Dès que possible'}{o.timeSlot ? ` · ${o.timeSlot}` : ''}</small></td>
                    <td><strong>{formatPrice(o.totalCents)}</strong></td>
                    <td>
                      <select className={`status-select status--${o.status}`} value={o.status} onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                    </td>
                    <td><a className="icon-btn icon-btn--sm" href={whatsappLink(o.phone.replace(/^0/, '33'), `Bonjour ${o.customerName}, c’est Mamie ! Votre commande ${o.reference} est bien reçue.`)} target="_blank" rel="noreferrer" aria-label="Contacter sur WhatsApp"><WhatsAppIcon size={16} /></a></td>
                  </tr>
                  {open === o.id && (
                    <tr className="admin-table__detail">
                      <td colSpan={7}>
                        <ul>{o.items.map((i, k) => <li key={k}>{i.quantity} × {i.productName} — {i.variantLabel} · {formatPrice(i.lineTotalCents)}</li>)}</ul>
                        {o.fulfilment === 'delivery' && <p><strong>Adresse :</strong> {o.address}, {o.postalCode} {o.city}</p>}
                        <p><strong>E-mail :</strong> {o.email}</p>
                        {o.notes && <p><strong>Notes :</strong> {o.notes}</p>}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ProductsPanel({ onAuthError }: { onAuthError: () => void }) {
  const guard = useAuthGuard(onAuthError);
  const { reload } = useShop();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => { api.products({}, true).then(setProducts).catch((e) => setError(guard(e))); }, [guard]);

  const patchProduct = async (p: Product, patch: Partial<Product>) => {
    try {
      const u = await api.updateProduct(p.id, patch);
      setProducts((l) => l?.map((x) => (x.id === p.id ? u : x)) ?? null);
      reload();
    } catch (e) { setError(guard(e)); }
  };
  const patchVariant = async (p: Product, variantId: number, patch: Partial<Variant>) => {
    try {
      const u = await api.updateVariant(variantId, patch);
      setProducts((l) => l?.map((x) => (x.id === p.id ? { ...x, variants: x.variants.map((v) => (v.id === variantId ? { ...v, ...u } : v)) } : x)) ?? null);
      setSaved(variantId);
      window.setTimeout(() => setSaved(null), 1500);
      reload();
    } catch (e) { setError(guard(e)); }
  };
  const patchPrice = (p: Product, variantId: number, euros: string) => {
    const cents = Math.round(parseFloat(euros.replace(',', '.')) * 100);
    if (Number.isNaN(cents) || cents < 0) return;
    patchVariant(p, variantId, { priceCents: cents });
  };

  if (!products) return error ? <p className="alert alert--error">{error}</p> : <Spinner />;
  return (
    <div className="admin-products">
      {error && <p className="alert alert--error">{error}</p>}
      {products.map((p) => (
        <div key={p.id} className={`card admin-product ${p.active ? '' : 'is-off'}`}>
          <img src={p.image} alt="" />
          <div className="admin-product__main">
            <strong>{p.name}</strong>
            <small>{p.category.name} · {p.kind === 'unit' ? 'À l’unité' : p.kind === 'bucket' ? 'Bucket' : 'Supplément'}</small>
            <div className="admin-product__variants">
              {p.variants.map((v) => (
                <label key={v.id} className={`${saved === v.id ? 'is-saved' : ''} ${v.active ? '' : 'is-off'}`}>
                  <input type="checkbox" checked={v.active} onChange={(e) => patchVariant(p, v.id, { active: e.target.checked })} aria-label={`${p.name} ${v.label} en vente`} />
                  <span>{v.label}</span>
                  <input defaultValue={(v.priceCents / 100).toFixed(2).replace('.', ',')} inputMode="decimal" onBlur={(e) => patchPrice(p, v.id, e.target.value)} aria-label={`Prix ${p.name} ${v.label}`} />
                  <span>€</span>
                </label>
              ))}
            </div>
            <button className="link admin-product__edit" onClick={() => setEditing(editing === p.id ? null : p.id)} aria-expanded={editing === p.id}>
              {editing === p.id ? 'Fermer' : 'Modifier les textes'}
            </button>
            {editing === p.id && <ProductTextForm product={p} onSave={async (patch) => { await patchProduct(p, patch); setEditing(null); }} />}
          </div>
          <div className="admin-product__toggles">
            <label className="switch"><input type="checkbox" checked={p.active} onChange={(e) => patchProduct(p, { active: e.target.checked })} /><span /> En vente</label>
            <label className="switch"><input type="checkbox" checked={p.featured} onChange={(e) => patchProduct(p, { featured: e.target.checked })} /><span /> Mis en avant</label>
          </div>
        </div>
      ))}
    </div>
  );
}

type ProductText = Pick<Product, 'name' | 'shortDescription' | 'description'>;

function ProductTextForm({ product, onSave }: { product: Product; onSave: (patch: ProductText) => Promise<void> }) {
  const [text, setText] = useState<ProductText>({
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description ?? '',
  });
  const [busy, setBusy] = useState(false);
  const set = (key: keyof ProductText) => (e: { target: { value: string } }) => setText((t) => ({ ...t, [key]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await onSave({ ...text, description: text.description?.trim() ? text.description : null }); } finally { setBusy(false); }
  };

  return (
    <form className="form admin-product__form" onSubmit={onSubmit}>
      <Field label="Nom"><input value={text.name} onChange={set('name')} maxLength={120} required /></Field>
      <Field label="Accroche (fiche et cartes)"><input value={text.shortDescription} onChange={set('shortDescription')} maxLength={255} /></Field>
      <Field label="Description détaillée"><textarea value={text.description ?? ''} onChange={set('description')} rows={4} /></Field>
      <button className="btn btn--primary btn--sm" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
    </form>
  );
}

function MessagesPanel({ onAuthError }: { onAuthError: () => void }) {
  const guard = useAuthGuard(onAuthError);
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api.adminMessages().then(setMessages).catch((e) => setError(guard(e))); }, [guard]);

  const toggle = async (m: ContactMessage) => {
    try {
      const u = await api.updateMessage(m.id, !m.handled);
      setMessages((l) => l?.map((x) => (x.id === m.id ? u : x)) ?? null);
    } catch (e) { setError(guard(e)); }
  };

  if (!messages) return error ? <p className="alert alert--error">{error}</p> : <Spinner />;
  if (!messages.length) return <p className="empty">Aucun message pour le moment.</p>;
  return (
    <div className="stack">
      {messages.map((m) => (
        <article key={m.id} className={`card message ${m.handled ? 'is-done' : ''}`}>
          <header>
            <strong>{m.name}</strong> · <a href={`mailto:${m.email}`}>{m.email}</a>{m.phone ? ` · ${m.phone}` : ''}
            <span className="muted"> — {formatDate(m.createdAt, true)}</span>
          </header>
          <p>{m.message}</p>
          <label className="switch"><input type="checkbox" checked={m.handled} onChange={() => toggle(m)} /><span /> Traité</label>
        </article>
      ))}
    </div>
  );
}
