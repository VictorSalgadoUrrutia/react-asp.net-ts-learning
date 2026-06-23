import type { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// 1. Guardián para rutas privadas (Bloquea a los intrusos)
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  
  // Si no hay token, lo patea al login. 
  // 'replace' borra el dashboard del historial para que no pueda usar "Atrás".
  if (!token) return <Navigate to="/" replace />;
  
  return children;
};

// 2. Guardián para rutas públicas (Bloquea a los que ya iniciaron sesión)
const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem('token');
  
  // Si ya tiene token, lo manda directo a su panel de trabajo.
  // 'replace' borra el login del historial.
  if (token) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Solo accesibles si NO estás logueado) */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />

        {/* Rutas Privadas (Solo accesibles si SÍ estás logueado) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Ruta Comodín (Si el usuario escribe una URL inventada, lo mandamos al inicio) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;