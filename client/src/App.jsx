import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/api';
import Home from './components/Home';
import Login from './components/Login';
import Denuncia from './components/Denuncia';
import VerDatos from './components/VerDatos';

// Componente para rutas protegidas
function ProtectedRoute({ children, requireAuth = true, adminOnly = false }) {
  const isAuthenticated = authService.isAuthenticated();
  const usuario = authService.getUsuarioActual();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && usuario && usuario.rol !== 'admin' && usuario.rol !== 'docente') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/denuncia"
          element={
            <ProtectedRoute>
              <Denuncia />
            </ProtectedRoute>
          }
        />

        {/* Rutas de administrador */}
        <Route
          path="/ver-datos"
          element={
            <ProtectedRoute adminOnly={true}>
              <VerDatos />
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
