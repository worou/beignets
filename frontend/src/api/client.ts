import type { ContactMessage, NewOrder, Order, OrderStatus, Product, Category, ShopConfig, Variant } from './types';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
const TOKEN_KEY = 'bdm_admin_token';

export class ApiError extends Error {
  status: number;
  violations: Record<string, string>;
  constructor(message: string, status: number, violations: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.violations = violations;
  }
}

export const tokenStore = {
  get: (): string | null => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (t: string | null) => {
    try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* stockage indisponible */ }
  },
};

async function request<T>(path: string, init: RequestInit & { auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json', ...(init.headers as Record<string, string>) };
  if (init.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  if (init.auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('Impossible de joindre le serveur. Vérifiez votre connexion.', 0);
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const violations: Record<string, string> = {};
    for (const v of data?.violations ?? []) {
      const key = String(v.propertyPath || '_').replace(/\[\d+\].*$/, '');
      if (!violations[key]) violations[key] = v.message;
    }
    const message =
      data?.violations?.[0]?.message ?? data?.detail ?? data?.message ?? data?.['hydra:description'] ?? 'Une erreur est survenue.';
    throw new ApiError(message, res.status, violations);
  }
  return data as T;
}

export const variantIri = (id: number) => `/api/product_variants/${id}`;

export const api = {
  shopConfig: () => request<ShopConfig>('/api/shop-config'),
  categories: () => request<Category[]>('/api/categories'),
  products: (params: Record<string, string> = {}, auth = false) => {
    const qs = new URLSearchParams(params).toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ''}`, { auth });
  },
  productBySlug: async (slug: string) => {
    const list = await request<Product[]>(`/api/products?slug=${encodeURIComponent(slug)}`);
    return list[0] ?? null;
  },
  createOrder: (order: NewOrder) => request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),
  order: (id: string) => request<Order>(`/api/orders/${id}`),
  sendContact: (msg: { name: string; email: string; phone?: string; message: string }) =>
    request<ContactMessage>('/api/contact_messages', { method: 'POST', body: JSON.stringify(msg) }),

  // ——— Administration ———
  login: (email: string, password: string) =>
    request<{ token: string }>('/api/login_check', { method: 'POST', body: JSON.stringify({ email, password }) }),
  adminOrders: (status?: string) =>
    request<Order[]>(`/api/orders${status ? `?status=${status}` : ''}`, { auth: true }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    request<Order>(`/api/orders/${id}`, {
      method: 'PATCH', auth: true, body: JSON.stringify({ status }),
      headers: { 'Content-Type': 'application/merge-patch+json' },
    }),
  updateProduct: (id: number, patch: Partial<Pick<Product, 'active' | 'featured' | 'name' | 'shortDescription' | 'description'>>) =>
    request<Product>(`/api/products/${id}`, {
      method: 'PATCH', auth: true, body: JSON.stringify(patch),
      headers: { 'Content-Type': 'application/merge-patch+json' },
    }),
  updateVariant: (id: number, patch: Partial<Pick<Variant, 'priceCents' | 'active' | 'label' | 'description'>>) =>
    request<Variant>(`/api/product_variants/${id}`, {
      method: 'PATCH', auth: true, body: JSON.stringify(patch),
      headers: { 'Content-Type': 'application/merge-patch+json' },
    }),
  adminMessages: () => request<ContactMessage[]>('/api/contact_messages', { auth: true }),
  updateMessage: (id: number, handled: boolean) =>
    request<ContactMessage>(`/api/contact_messages/${id}`, {
      method: 'PATCH', auth: true, body: JSON.stringify({ handled }),
      headers: { 'Content-Type': 'application/merge-patch+json' },
    }),
};
