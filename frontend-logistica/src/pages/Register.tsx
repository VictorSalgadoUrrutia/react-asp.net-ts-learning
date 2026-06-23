import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, UserPlus } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Función de validación del lado del cliente
  const validateForm = () => {
    if (username.length < 4) {
      return 'El usuario debe tener al menos 4 caracteres.';
    }
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', { username, password });
      // Redirigir al login tras un registro exitoso
      navigate('/', { state: { message: 'Cuenta creada con éxito. Inicia sesión.' } });
    } catch (err: any) {
      setError(err.response?.data || 'Error al registrar el usuario en el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 text-neutral-100">
      <div className="max-w-md w-full bg-neutral-800 rounded-xl shadow-2xl p-8 border border-neutral-700">
        
        <div className="flex flex-col items-center mb-6">
          <div className="bg-emerald-500/10 p-3 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Crear Cuenta</h1>
          <div className="flex items-center gap-1 text-neutral-400 text-sm mt-2">
            <MapPin className="w-4 h-4" />
            <span>Operaciones - Cancún, Q.R.</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Nuevo Usuario</label>
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

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-neutral-100"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded text-sm text-center bg-red-400/10 text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-neutral-400 hover:text-emerald-400 transition-colors">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>

      </div>
    </div>
  );
}