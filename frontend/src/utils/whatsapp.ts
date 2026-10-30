import type { Order } from '../api/types';
import type { CartLine } from '../context/CartContext';
import { formatPrice } from './format';

export const DEFAULT_WHATSAPP = '33767339532';

export function whatsappLink(number: string, text?: string) {
  const n = number.replace(/\D/g, '');
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function cartMessage(lines: CartLine[], totalCents: number) {
  const rows = lines.map((l) => `• ${l.quantity} × ${l.productName} — ${l.variantLabel} (${formatPrice(l.priceCents * l.quantity)})`);
  return ['Bonjour Mamie ! 👋 Je souhaite commander :', '', ...rows, '', `Total : ${formatPrice(totalCents)}`, '', 'Merci !'].join('\n');
}

export function orderMessage(order: Order) {
  const rows = order.items.map((i) => `• ${i.quantity} × ${i.productName} — ${i.variantLabel}`);
  const mode = order.fulfilment === 'delivery'
    ? `Livraison : ${order.address}, ${order.postalCode} ${order.city}`
    : 'Retrait sur place';
  return [
    `Bonjour Mamie ! Voici ma commande ${order.reference} :`, '', ...rows, '',
    `Total : ${formatPrice(order.totalCents)}`, mode,
    order.requestedDate ? `Souhaitée le ${order.requestedDate.slice(0, 10)}${order.timeSlot ? ` (${order.timeSlot})` : ''}` : '',
    `Nom : ${order.customerName}`,
  ].filter(Boolean).join('\n');
}
