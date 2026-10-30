import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '../api/client';
import type { Category, Product, ShopConfig } from '../api/types';
import { DEFAULT_WHATSAPP } from '../utils/whatsapp';

interface ShopState {
  config: ShopConfig;
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const FALLBACK_CONFIG: ShopConfig = {
  whatsappNumber: DEFAULT_WHATSAPP,
  deliveryFeeCents: 390,
  freeDeliveryThresholdCents: 3000,
  minimumOrderCents: 1000,
  deliveryArea: 'Paris et Île-de-France',
  deliveryPostalPrefixes: ['75', '77', '78', '91', '92', '93', '94', '95'],
  timeSlots: ['9h – 12h', '12h – 15h', '15h – 18h', '18h – 20h'],
};

const ShopContext = createContext<ShopState | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ShopConfig>(FALLBACK_CONFIG);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([api.shopConfig().catch(() => FALLBACK_CONFIG), api.products(), api.categories()])
      .then(([cfg, prods, cats]) => {
        if (cancelled) return;
        setConfig(cfg);
        setProducts(prods);
        setCategories(cats);
        setError(null);
      })
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [tick]);

  return (
    <ShopContext.Provider value={{ config, products, categories, loading, error, reload: () => setTick((t) => t + 1) }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop doit être utilisé dans <ShopProvider>');
  return ctx;
}
