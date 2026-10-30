export type ProductKind = 'unit' | 'bucket' | 'extra';
export type Fulfilment = 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type BrandColor = 'green' | 'yellow' | 'orange' | 'brown' | 'red';

export interface Category {
  id: number;
  name: string;
  slug: string;
  tagline?: string | null;
  color: BrandColor;
  position?: number;
}

export interface Variant {
  id: number;
  label: string;
  description?: string | null;
  pieces: number;
  priceCents: number;
  position?: number;
  active: boolean;
}

export interface Product {
  id: number;
  category: Category;
  name: string;
  slug: string;
  kind: ProductKind;
  shortDescription: string;
  description?: string | null;
  image: string;
  unitLabel?: string | null;
  featured: boolean;
  active: boolean;
  position: number;
  variants: Variant[];
  fromPriceCents: number | null;
}

export interface ShopConfig {
  whatsappNumber: string;
  deliveryFeeCents: number;
  freeDeliveryThresholdCents: number;
  minimumOrderCents: number;
  deliveryArea: string;
  deliveryPostalPrefixes: string[];
  timeSlots: string[];
}

export interface OrderItem {
  productName: string;
  variantLabel: string;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  email: string;
  phone: string;
  fulfilment: Fulfilment;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  requestedDate?: string | null;
  timeSlot?: string | null;
  notes?: string | null;
  status: OrderStatus;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  createdAt: string;
  updatedAt?: string | null;
  items: OrderItem[];
}

export interface NewOrder {
  customerName: string;
  email: string;
  phone: string;
  fulfilment: Fulfilment;
  address?: string;
  postalCode?: string;
  city?: string;
  requestedDate?: string | null;
  timeSlot?: string;
  notes?: string;
  items: { variant: string; quantity: number }[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
}
