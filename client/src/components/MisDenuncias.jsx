import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { denunciaService, authService } from '../services/api';
import './MisDenuncias.css';

function MisDenuncias() {
  const navigate = useNavigate();
  const [denuncias, setDenuncias] = useState([]);
  const [denunciasFiltradas, setDenunciasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const usuario = authService.getUsuarioActual();

  useEffect(() => {
    cargarDenuncias();
  }, []);

  useEffect(() => {
    filtrarDenuncias();
  }, [filtroEstado, denuncias]);

  const cargarDenuncias = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await denunciaService.misDenuncias();
      
      if (data.success) {
        setDenuncias(data.denuncias || []);
      } else {
        setError(data.message || 'No se pudieron cargar las denuncias');
      }
    } catch (err) {
      console.error('Error cargando denuncias:', err);
      setError('Error al cargar tus denuncias. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filtrarDenuncias = () => {
    if (filtroEstado === 'todas') {
      setDenunciasFiltradas(denuncias);
    } else {
      const filtradas = denuncias.filter(d => d.estado === filtroEstado);
      setDenunciasFiltradas(filtradas);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'recibida': { text: 'Recibida', class: 'badge-nueva' },
      'en_revision': { text: 'En Revisión', class: 'badge-revision' },
      'en_proceso': { text: 'En Proceso', class: 'badge-proceso' },
      'investigacion': { text: 'Investigación', class: 'badge-investigacion' },
      'resuelta': { text: 'Resuelta', class: 'badge-resuelta' },
      'cerrada': { text: 'Cerrada', class: 'badge-cerrada' }
    };
    return badges[estado] || { text: estado, class: 'badge-default' };
  };

  const getGravedadBadge = (gravedad) => {
    const badges = {
      'alta': { text: 'Alta', class: 'gravedad-alta' },
      'media': { text: 'Media', class: 'gravedad-media' },
      'baja': { text: 'Baja', class: 'gravedad-baja' }
    };
    return badges[gravedad] || { text: gravedad, class: 'gravedad-default' };
  };

  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  const contarPorEstado = (estado) => {
    if (estado === 'todas') return denuncias.length;
    return denuncias.filter(d => d.estado === estado).length;
  };

  return (
    <div className="mis-denuncias-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <Link to="/" className="nav-brand">
            <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" />
            <h1>VozSegura</h1>
          </Link>
          <nav className="header-nav">
            <div className="user-info">
              <i className="fas fa-user-circle"></i>
              <span>{usuario?.nombre}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              <i className="fas fa-sign-out-alt"></i>
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container-wide">
          {/* Título y Acciones */}
          <div className="page-header">
            <div>
              <h1 className="page-title">Mis Denuncias</h1>
              <p className="page-subtitle">Gestiona y da seguimiento a todas tus denuncias</p>
            </div>
            <Link to="/denuncia" className="btn-nueva-denuncia">
              <i className="fas fa-plus"></i>
              Nueva Denuncia
            </Link>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon total">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="stat-info">
                <h3>{contarPorEstado('todas')}</h3>
                <p>Total de denuncias</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon nuevas">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{contarPorEstado('recibida')}</h3>
                <p>Recibidas</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon proceso">
                <i className="fas fa-spinner"></i>
              </div>
              <div className="stat-info">
                <h3>{contarPorEstado('en_proceso') + contarPorEstado('en_revision')}</h3>
                <p>En proceso</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon resueltas">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{contarPorEstado('resuelta')}</h3>
                <p>Resueltas</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="filtros-section">
            <div className="filtros-tabs">
              <button
                className={`tab ${filtroEstado === 'todas' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('todas')}
              >
                <i className="fas fa-th-large"></i>
                Todas ({contarPorEstado('todas')})
              </button>
              <button
                className={`tab ${filtroEstado === 'recibida' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('recibida')}
              >
                <i className="fas fa-inbox"></i>
                Recibidas ({contarPorEstado('recibida')})
              </button>
              <button
                className={`tab ${filtroEstado === 'en_proceso' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('en_proceso')}
              >
                <i className="fas fa-hourglass-half"></i>
                En Proceso ({contarPorEstado('en_proceso')})
              </button>
              <button
                className={`tab ${filtroEstado === 'resuelta' ? 'active' : ''}`}
                onClick={() => setFiltroEstado('resuelta')}
              >
                <i className="fas fa-check-circle"></i>
                Resueltas ({contarPorEstado('resuelta')})
              </button>
            </div>
          </div>

          {/* Lista de Denuncias */}
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Cargando tus denuncias...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <i className="fas fa-exclamation-triangle"></i>
              <h3>Error al cargar denuncias</h3>
              <p>{error}</p>
              <button onClick={cargarDenuncias} className="btn-retry">
                <i className="fas fa-redo"></i>
                Reintentar
              </button>
            </div>
          ) : denunciasFiltradas.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <h3>No hay denuncias {filtroEstado !== 'todas' ? `en estado "${filtroEstado}"` : ''}</h3>
              <p>
                {filtroEstado === 'todas' 
                  ? 'Aún no has realizado ninguna denuncia.'
                  : 'No tienes denuncias en este estado.'}
              </p>
              {filtroEstado === 'todas' && (
                <Link to="/denuncia" className="btn-primera-denuncia">
                  <i className="fas fa-plus"></i>
                  Crear mi primera denuncia
                </Link>
              )}
            </div>
          ) : (
            <div className="denuncias-grid">
              {denunciasFiltradas.map((denuncia) => (
                <div key={denuncia.id} className="denuncia-card">
                  <div className="denuncia-header">
                    <div className="denuncia-codigo">
                      <i className="fas fa-hashtag"></i>
                      <span>{denuncia.codigo}</span>
                    </div>
                    <div className="badges">
                      <span className={`badge ${getEstadoBadge(denuncia.estado).class}`}>
                        {getEstadoBadge(denuncia.estado).text}
                      </span>
                      <span className={`badge-gravedad ${getGravedadBadge(denuncia.gravedad).class}`}>
                        {getGravedadBadge(denuncia.gravedad).text}
                      </span>
                    </div>
                  </div>

                  <div className="denuncia-body">
                    <h3 className="denuncia-tipo">
                      <i className="fas fa-exclamation-circle"></i>
                      {denuncia.tipo}
                    </h3>
                    <p className="denuncia-descripcion">
                      {denuncia.descripcion.length > 150
                        ? denuncia.descripcion.substring(0, 150) + '...'
                        : denuncia.descripcion}
                    </p>

                    <div className="denuncia-meta">
                      <div className="meta-item">
                        <i className="fas fa-calendar"></i>
                        <span>{formatFecha(denuncia.fecha)}</span>
                      </div>
                      {denuncia.facultad_nombre && (
                        <div className="meta-item">
                          <i className="fas fa-building"></i>
                          <span>{denuncia.facultad_nombre}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="denuncia-footer">
                    <Link 
                      to={`/consultar?codigo=${denuncia.codigo}`} 
                      className="btn-ver-detalle"
                    >
                      <i className="fas fa-eye"></i>
                      Ver seguimiento
                    </Link>
                    <button className="btn-icon" title="Más opciones">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer Informativo */}
      <footer className="dashboard-footer">
        <div className="container">
          <div className="footer-info">
            <div className="info-item">
              <i className="fas fa-shield-alt"></i>
              <div>
                <h4>Confidencialidad garantizada</h4>
                <p>Tus datos están protegidos</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-headset"></i>
              <div>
                <h4>Soporte 24/7</h4>
                <p>Estamos aquí para ayudarte</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone-alt"></i>
              <div>
                <h4>Línea de emergencia</h4>
                <p>123 - Disponible siempre</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MisDenuncias;
