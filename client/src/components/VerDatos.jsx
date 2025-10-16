import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './VerDatos.css';

function VerDatos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalUsuarios: 0, totalDenuncias: 0 });
  const [usuarios, setUsuarios] = useState([]);
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    // Verificar que el usuario sea admin o docente
    const usuario = authService.getUsuarioActual();
    if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'docente')) {
      navigate('/');
      return;
    }

    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/test/ver-datos');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error al cargar datos');
      }

      setStats({
        totalUsuarios: data.totalUsuarios,
        totalDenuncias: data.totalDenuncias
      });
      setUsuarios(data.usuarios || []);
      setDenuncias(data.denuncias || []);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="ver-datos-page">
      <div className="container">
        <div className="header-actions">
          <h1>📊 Datos Guardados en VozSegura</h1>
          <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
        </div>

        <button className="btn-refresh" onClick={cargarDatos}>
          🔄 Actualizar Datos
        </button>

        {loading && <div className="loading">Cargando datos...</div>}

        {error && <div className="error">❌ Error: {error}</div>}

        {!loading && !error && (
          <>
            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">Total Usuarios</div>
                <div className="stat-number">{stats.totalUsuarios}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Denuncias</div>
                <div className="stat-number">{stats.totalDenuncias}</div>
              </div>
            </div>

            <div className="section">
              <h2>👥 Usuarios Registrados</h2>
              <div className="items-list">
                {usuarios.length === 0 ? (
                  <div className="empty">No hay usuarios registrados todavía</div>
                ) : (
                  usuarios.map((usuario, index) => (
                    <div key={usuario.id} className="item">
                      <div className="item-content">
                        <strong>Usuario #{index + 1}:</strong> {usuario.nombre}
                      </div>
                      <div className="item-content">
                        <strong>Email:</strong> {usuario.email}
                      </div>
                      <div className="item-content">
                        <strong>Rol:</strong> {usuario.rol}
                      </div>
                      <div className="item-content">
                        <strong>Institución:</strong> {usuario.institucion || 'No especificada'}
                      </div>
                      <div className="item-content">
                        <strong>Registrado:</strong>{' '}
                        <span className="timestamp">
                          {new Date(usuario.createdAt).toLocaleString('es')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="section">
              <h2>📢 Denuncias Registradas</h2>
              <div className="items-list">
                {denuncias.length === 0 ? (
                  <div className="empty">No hay denuncias registradas todavía</div>
                ) : (
                  denuncias.map((denuncia, index) => (
                    <div key={denuncia.id} className="item">
                      <div className="item-content">
                        <strong>Denuncia #{index + 1}:</strong>{' '}
                        <span className="codigo">{denuncia.codigo}</span>
                      </div>
                      <div className="item-content">
                        <strong>Tipo:</strong> {denuncia.tipo}
                      </div>
                      <div className="item-content">
                        <strong>Descripción:</strong> {denuncia.descripcion}
                      </div>
                      <div className="item-content">
                        <strong>Estado:</strong>{' '}
                        <span className={`estado ${denuncia.estado}`}>
                          {denuncia.estado.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="item-content">
                        <strong>Ubicación:</strong> {denuncia.ubicacion || 'No especificada'}
                      </div>
                      <div className="item-content">
                        <strong>Anónima:</strong> {denuncia.anonima ? 'Sí' : 'No'}
                      </div>
                      {denuncia.usuario && (
                        <div className="item-content">
                          <strong>Usuario:</strong> {denuncia.usuario.nombre} ({denuncia.usuario.email})
                        </div>
                      )}
                      <div className="item-content">
                        <strong>Creada:</strong>{' '}
                        <span className="timestamp">
                          {new Date(denuncia.createdAt).toLocaleString('es')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerDatos;
