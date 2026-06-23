import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <nav className="border-b border-neutral-800 bg-neutral-950 px-6 py-4 flex justify-between items-center">
        <h1 className="font-semibold text-lg text-emerald-400">Logística Centro</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-400">Conectado como <strong className="text-neutral-200">{username}</strong></span>
          <button onClick={handleLogout} className="text-neutral-400 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>
      
      <main className="p-8">
        <div className="p-6 border border-neutral-800 rounded-xl bg-neutral-800/50">
          <h2 className="text-xl mb-2">Panel Principal</h2>
          <p className="text-neutral-400">La conexión con el backend .NET está funcionando correctamente.</p>
        </div>
      </main>
    </div>
  );
}