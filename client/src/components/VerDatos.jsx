import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, denunciaService } from '../services/api';
import './VerDatos.css';

function VerDatos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [denuncias, setDenuncias] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('🔵 VerDatos - Cargando denuncias...');
      const data = await denunciaService.obtenerTodas();
      
      console.log('✅ Denuncias cargadas:', data);

      if (data.success) {
        setDenuncias(data.denuncias || []);
      } else {
        throw new Error(data.message || 'Error al cargar denuncias');
      }
    } catch (err) {
      console.error('❌ Error cargando denuncias:', err);
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
          <h1>Datos almacenados en VozSegura</h1>
          <div className="header-buttons">
            <Link to="/dashboard" className="btn-dashboard">
              <i className="fas fa-chart-line"></i>
              Dashboard
            </Link>
            <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>

        <button className="btn-refresh" onClick={cargarDatos}>
          Actualizar Datos
        </button>

        {loading && <div className="loading">Cargando datos...</div>}

        {error && <div className="error">❌ Error: {error}</div>}

        {!loading && !error && (
          <>
            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">Total Denuncias</div>
                <div className="stat-number">{denuncias.length}</div>
              </div>
            </div>

            <div className="section">
              <h2>Denuncias Registradas</h2>
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
                          {denuncia.estado?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="item-content">
                        <strong>Gravedad:</strong>{' '}
                        <span className={`gravedad ${denuncia.gravedad}`}>
                          {denuncia.gravedad}
                        </span>
                      </div>
                      <div className="item-content">
                        <strong>Fecha:</strong>{' '}
                        <span className="timestamp">
                          {new Date(denuncia.fecha || denuncia.fecha_creacion).toLocaleString('es-ES')}
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
