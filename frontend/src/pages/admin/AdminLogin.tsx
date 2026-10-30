import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { ChefHat } from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
import { Field } from '../Contact';

export default function AdminLogin() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError && err.status === 401 ? 'Identifiants incorrects.' : (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section admin-login">
      <form className="card form" onSubmit={onSubmit}>
        <div className="center"><ChefHat size={64} /></div>
        <h1 className="h3 center">Espace Mamie</h1>
        {error && <p className="alert alert--error">{error}</p>}
        <Field label="E-mail"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></Field>
        <Field label="Mot de passe"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></Field>
        <button className="btn btn--primary btn--block" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </section>
  );
}
