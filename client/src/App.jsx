import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { authService } from './services/api';
import Home from './components/Home';
import Login from './components/Login';
import Denuncia from './components/Denuncia';
import VerDatos from './components/VerDatos';
import ConsultarDenuncia from './components/ConsultarDenuncia';
import MisDenuncias from './components/MisDenuncias';
import Dashboard from './components/Dashboard';
import Usuarios from './components/Usuarios';

// Componente para rutas protegidas - VERSIÓN SÍNCRONA
function ProtectedRoute({ children, requireAuth = true, adminOnly = false }) {
  const location = useLocation();
  
  // Leer directamente del localStorage (síncrono)
  const token = localStorage.getItem('token');
  const usuarioStr = localStorage.getItem('usuario');
  const isAuthenticated = !!token;
  
  let usuario = null;
  try {
    if (usuarioStr) {
      usuario = JSON.parse(usuarioStr);
    }
  } catch (error) {
    console.error('Error parseando usuario:', error);
    localStorage.removeItem('usuario');
  }

  console.log('ProtectedRoute - Verificando acceso en:', location.pathname, {
    isAuthenticated,
    usuario,
    usuarioRol: usuario?.rol,
    adminOnly,
    requireAuth
  });

  // Verificar autenticación requerida
  if (requireAuth && !isAuthenticated) {
    console.log('No autenticado - Redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Verificar permiso de admin
  if (adminOnly) {
    if (!usuario) {
      console.log('No hay usuario - Redirigiendo a login');
      return <Navigate to="/login" replace />;
    }
    
    console.log('Verificando si es admin:', {
      rol: usuario.rol,
      esAdmin: usuario.rol === 'admin'
    });
    
    if (usuario.rol !== 'admin') {
      console.log('No es admin (rol:', usuario.rol, ') - Redirigiendo a mis-denuncias');
      return <Navigate to="/mis-denuncias" replace />;
    }
    
    console.log('ES ADMIN - ACCESO PERMITIDO AL DASHBOARD');
  }

  console.log('Acceso permitido a:', location.pathname);
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consultar" element={<ConsultarDenuncia />} />

        {/* Rutas protegidas */}
        <Route
          path="/mis-denuncias"
          element={
            <ProtectedRoute>
              <MisDenuncias />
            </ProtectedRoute>
          }
        />
        <Route
          path="/denuncia"
          element={
            <ProtectedRoute>
              <Denuncia />
            </ProtectedRoute>
          }
        />

        {/* Rutas solo para admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ver-datos"
          element={
            <ProtectedRoute adminOnly={true}>
              <VerDatos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute adminOnly={true}>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
