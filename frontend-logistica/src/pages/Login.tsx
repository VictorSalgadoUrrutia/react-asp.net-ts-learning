import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { MapPin, Truck } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation(); // Para cachar mensajes de redirección

  // Si venimos del registro exitoso, mostramos el mensaje
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMsg(location.state.message);
      // Limpiamos el state para que no vuelva a salir si recarga la página
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 text-neutral-100">
      <div className="max-w-md w-full bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-700">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-500/10 p-3 rounded-full mb-4">
            <Truck className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sistema de Coordinación</h1>
          <div className="flex items-center gap-1 text-neutral-400 text-sm mt-2">
            <MapPin className="w-4 h-4" />
            <span>Operaciones - Cancún, Q.R.</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-neutral-100"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-neutral-100"
              required
            />
          </div>

          {error && <div className="p-3 rounded text-sm text-center bg-red-400/10 text-red-400">{error}</div>}
          {successMsg && <div className="p-3 rounded text-sm text-center bg-emerald-500/10 text-emerald-400">{successMsg}</div>}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            Ingresar al Sistema
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>

      </div>
    </div>
  );
}