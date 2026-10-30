import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Story from './pages/Story';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Pricing from './pages/Pricing';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="notre-histoire" element={<Story />} />
        <Route path="produits" element={<Products />} />
        <Route path="produits/:slug" element={<ProductDetail />} />
        <Route path="tarifs" element={<Pricing />} />
        <Route path="galerie" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="panier" element={<Cart />} />
        <Route path="commande" element={<Checkout />} />
        <Route path="commande/:id" element={<OrderConfirmation />} />
        <Route path="mentions-legales" element={<Legal />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/connexion" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
