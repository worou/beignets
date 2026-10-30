import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Order } from '../api/types';
import { CheckIcon, HeartIcon, WhatsAppIcon } from '../components/Icons';
import { Spinner } from '../components/Ui';
import { useShop } from '../context/ShopContext';
import { formatDate, formatPrice, STATUS_LABELS } from '../utils/format';
import { orderMessage, whatsappLink } from '../utils/whatsapp';

export default function OrderConfirmation() {
  const { id = '' } = useParams();
  const { config } = useShop();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { api.order(id).then(setOrder).catch((e: Error) => setError(e.message)); }, [id]);

  if (error) return <div className="container section center"><p className="alert alert--error">{error}</p><Link to="/" className="btn btn--primary">Retour à l’accueil</Link></div>;
  if (!order) return <div className="container section"><Spinner /></div>;

  return (
    <section className="section section--tight">
      <div className="container confirm">
        <div className="confirm__head">
          <span className="confirm__check"><CheckIcon size={36} /></span>
          <h1>Merci {order.customerName.split(' ')[0]} !</h1>
          <p>Votre commande <strong>{order.reference}</strong> est bien reçue. Mamie la confirme très vite par téléphone ou WhatsApp.</p>
          <span className={`status status--${order.status}`}>{STATUS_LABELS[order.status]}</span>
        </div>

        <div className="card">
          <table className="order-table">
            <tbody>
              {order.items.map((i, k) => (
                <tr key={k}><td>{i.quantity} × {i.productName} <small>{i.variantLabel}</small></td><td>{formatPrice(i.lineTotalCents)}</td></tr>
              ))}
              <tr><td>{order.fulfilment === 'delivery' ? 'Livraison' : 'Retrait'}</td><td>{order.deliveryFeeCents ? formatPrice(order.deliveryFeeCents) : 'Offert'}</td></tr>
              <tr className="order-table__total"><td>Total à régler</td><td>{formatPrice(order.totalCents)}</td></tr>
            </tbody>
          </table>
          <div className="confirm__meta">
            <div><strong>{order.fulfilment === 'delivery' ? 'Adresse de livraison' : 'Mode'}</strong>
              <span>{order.fulfilment === 'delivery' ? `${order.address}, ${order.postalCode} ${order.city}` : 'Retrait sur rendez-vous'}</span></div>
            <div><strong>Date souhaitée</strong><span>{order.requestedDate ? formatDate(order.requestedDate) : 'Dès que possible'}{order.timeSlot ? ` · ${order.timeSlot}` : ''}</span></div>
            <div><strong>Contact</strong><span>{order.phone} · {order.email}</span></div>
          </div>
        </div>

        <div className="confirm__actions">
          <a className="btn btn--whatsapp btn--lg" href={whatsappLink(config.whatsappNumber, orderMessage(order))} target="_blank" rel="noreferrer">
            <WhatsAppIcon /> Prévenir Mamie sur WhatsApp
          </a>
          <Link to="/" className="btn btn--outline btn--lg">Retour à l’accueil</Link>
        </div>
        <p className="center muted">Merci de votre confiance <HeartIcon size={14} /></p>
      </div>
    </section>
  );
}
