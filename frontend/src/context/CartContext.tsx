import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export interface CartLine {
  variantId: number;
  productSlug: string;
  productName: string;
  variantLabel: string;
  variantDescription?: string | null;
  image: string;
  priceCents: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (variantId: number, quantity: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
  lastAdded: CartLine | null;
  dismissLastAdded: () => void;
}

const CartContext = createContext<CartState | null>(null);
const KEY = 'bdm_cart_v1';
const MAX_QTY = 200;

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [lastAdded, setLastAdded] = useState<CartLine | null>(null);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* stockage indisponible */ }
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, 'quantity'>, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === line.variantId);
      if (existing) {
        return prev.map((l) => l.variantId === line.variantId ? { ...l, ...line, quantity: Math.min(MAX_QTY, l.quantity + quantity) } : l);
      }
      return [...prev, { ...line, quantity }];
    });
    setLastAdded({ ...line, quantity });
  }, []);

  const setQuantity = useCallback((variantId: number, quantity: number) => {
    setLines((prev) => quantity <= 0
      ? prev.filter((l) => l.variantId !== variantId)
      : prev.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)));
  }, []);

  const remove = useCallback((variantId: number) => setLines((prev) => prev.filter((l) => l.variantId !== variantId)), []);
  const clear = useCallback(() => setLines([]), []);
  const dismissLastAdded = useCallback(() => setLastAdded(null), []);

  const value = useMemo<CartState>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotalCents: lines.reduce((s, l) => s + l.priceCents * l.quantity, 0),
    add, setQuantity, remove, clear, lastAdded, dismissLastAdded,
  }), [lines, add, setQuantity, remove, clear, lastAdded, dismissLastAdded]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>');
  return ctx;
}
