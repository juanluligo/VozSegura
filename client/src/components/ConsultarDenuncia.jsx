import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { denunciaService } from '../services/api';
import './ConsultarDenuncia.css';

function ConsultarDenuncia() {
  const [searchParams] = useSearchParams();
  const [codigo, setCodigo] = useState(searchParams.get('codigo') || '');
  const [denuncia, setDenuncia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actualizaciones, setActualizaciones] = useState([]);

  // Auto-consultar si viene código en la URL
  useEffect(() => {
    const codigoParam = searchParams.get('codigo');
    if (codigoParam) {
      setCodigo(codigoParam);
      consultarDenuncia(codigoParam);
    }
  }, [searchParams]);

  const consultarDenuncia = async (codigoAConsultar) => {
    setError('');
    setDenuncia(null);

    if (!codigoAConsultar || !codigoAConsultar.trim()) {
      setError('Por favor ingresa un código de seguimiento');
      return;
    }

    setLoading(true);
    try {
      const data = await denunciaService.consultarPorCodigo(codigoAConsultar);
      
      if (data.success) {
        setDenuncia(data.denuncia);
        generarActualizaciones(data.denuncia);
      } else {
        setError(data.message || 'Denuncia no encontrada');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('No se encontró ninguna denuncia con ese código');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultar = (e) => {
    e.preventDefault();
    consultarDenuncia(codigo);
  };

  const generarActualizaciones = (denuncia) => {
    const updates = [
      {
        fecha: denuncia.fecha_creacion || denuncia.fecha,
        hora: '10:30 AM',
        mensaje: 'Tu denuncia fue registrada exitosamente'
      }
    ];

    if (denuncia.estado !== 'recibida') {
      updates.push({
        fecha: new Date().toISOString().split('T')[0],
        hora: '10:15 AM',
        mensaje: 'El equipo especializado está evaluando tu caso'
      });
    }

    if (denuncia.estado === 'en_proceso' || denuncia.estado === 'resuelta') {
      updates.push({
        fecha: new Date().toISOString().split('T')[0],
        hora: '3:45 PM',
        mensaje: 'Denuncia recibida y validada correctamente'
      });
    }

    setActualizaciones(updates.reverse());
  };

  const getEstadoInfo = (estado) => {
    const estados = {
      'recibida': { nombre: 'Denuncia recibida', step: 1, color: '#10b981' },
      'en_revision': { nombre: 'En revisión', step: 2, color: '#3b82f6' },
      'investigacion': { nombre: 'Investigación', step: 3, color: '#f59e0b' },
      'en_proceso': { nombre: 'En revisión', step: 2, color: '#3b82f6' },
      'resuelta': { nombre: 'Resolución', step: 4, color: '#10b981' },
      'cerrada': { nombre: 'Resolución', step: 4, color: '#6b7280' }
    };
    return estados[estado] || estados['recibida'];
  };

  const formatFecha = (fecha) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', options);
  };

  return (
    <div className="consultar-page">
      {/* Header */}
      <header className="consultar-header">
        <div className="container">
          <Link to="/" className="nav-brand">
            <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" />
            <h1>VozSegura</h1>
          </Link>
          <nav className="header-nav">
            <Link to="/">Inicio</Link>
            <Link to="/ayuda">Ayuda</Link>
            <Link to="/login" className="btn-login">Iniciar sesión</Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">Inicio</Link>
          <span className="separator">›</span>
          <span>Consultar denuncia</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="consultar-main">
        <div className="container">
          <div className="consultar-content">
            <h1 className="page-title">Consulta tu denuncia</h1>
            <p className="page-subtitle">
              Ingresa tu código de seguimiento para conocer el estado actual
            </p>

            {/* Formulario de búsqueda */}
            <div className="search-box">
              <form onSubmit={handleConsultar}>
                <div className="form-group-consultar">
                  <label htmlFor="codigo">Código de seguimiento</label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      id="codigo"
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      placeholder="VS-2024-ABC123"
                      className="codigo-input"
                    />
                    <button 
                      type="submit" 
                      className="btn-consultar"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Consultando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search"></i>
                          Consultar
                        </>
                      )}
                    </button>
                  </div>
                  <small className="hint">
                    Ejemplo: VS-2024-ABC123 (código de 15 caracteres)
                    <br />
                    * Tu código te fue enviado un código seguro
                  </small>
                </div>
              </form>

              {error && (
                <div className="alert alert-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}
            </div>

            {/* Resultados */}
            {denuncia && (
              <div className="resultado-consulta">
                {/* Card de Estado */}
                <div className="estado-card">
                  <div className="estado-header">
                    <i className="fas fa-clipboard-check"></i>
                    <h3>Estado de tu denuncia</h3>
                  </div>
                  <div className="estado-info">
                    <p className="codigo-denuncia">Código: {denuncia.codigo}</p>
                    <p className="fecha-denuncia">
                      Recibida el {formatFecha(denuncia.fecha_creacion || denuncia.fecha)}
                    </p>
                  </div>
                </div>

                {/* Timeline de Progreso */}
                <div className="progreso-card">
                  <h3 className="progreso-title">Progreso del caso</h3>
                  
                  <div className="timeline">
                    <div className={`timeline-step ${getEstadoInfo(denuncia.estado).step >= 1 ? 'completed' : ''}`}>
                      <div className="step-marker">
                        {getEstadoInfo(denuncia.estado).step >= 1 ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>1</span>
                        )}
                      </div>
                      <div className="step-content">
                        <h4>Denuncia recibida</h4>
                        <p>15 mar, 2024 - 10:30 AM</p>
                        <small>Tu denuncia fue registrada exitosamente</small>
                      </div>
                    </div>

                    <div className={`timeline-step ${getEstadoInfo(denuncia.estado).step >= 2 ? 'active' : ''} ${getEstadoInfo(denuncia.estado).step > 2 ? 'completed' : ''}`}>
                      <div className="step-marker">
                        {getEstadoInfo(denuncia.estado).step > 2 ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>2</span>
                        )}
                      </div>
                      <div className="step-content">
                        <h4>En revisión</h4>
                        <p>16 mar, 2024 - 10:15 AM</p>
                        <small>El equipo especializado está evaluando tu caso</small>
                      </div>
                    </div>

                    <div className={`timeline-step ${getEstadoInfo(denuncia.estado).step >= 3 ? 'active' : ''} ${getEstadoInfo(denuncia.estado).step > 3 ? 'completed' : ''}`}>
                      <div className="step-marker">
                        {getEstadoInfo(denuncia.estado).step > 3 ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>3</span>
                        )}
                      </div>
                      <div className="step-content">
                        <h4>Investigación</h4>
                        <p className="pendiente">Pendiente</p>
                        <small>Se iniciará la investigación formal</small>
                      </div>
                    </div>

                    <div className={`timeline-step ${getEstadoInfo(denuncia.estado).step >= 4 ? 'completed' : ''}`}>
                      <div className="step-marker">
                        {getEstadoInfo(denuncia.estado).step >= 4 ? (
                          <i className="fas fa-check"></i>
                        ) : (
                          <span>4</span>
                        )}
                      </div>
                      <div className="step-content">
                        <h4>Resolución</h4>
                        <p className="pendiente">Pendiente</p>
                        <small>Se implementarán las medidas necesarias</small>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje de estado actual */}
                  <div className="estado-actual">
                    <i className="fas fa-info-circle"></i>
                    <p>
                      <strong>Te acompañamos en este proceso</strong>
                      <br />
                      Tu valentía al denunciar está generando un cambio positivo. Estamos contigo en cada paso.
                    </p>
                  </div>
                </div>

                {/* Actualizaciones */}
                {actualizaciones.length > 0 && (
                  <div className="actualizaciones-card">
                    <div className="card-header">
                      <i className="fas fa-bell"></i>
                      <h3>Actualizaciones</h3>
                    </div>
                    <p className="subtitle">Historial de notificaciones</p>
                    
                    <div className="actualizaciones-list">
                      {actualizaciones.map((update, index) => (
                        <div key={index} className="update-item">
                          <div className="update-icon">
                            <i className="fas fa-clock"></i>
                          </div>
                          <div className="update-content">
                            <p className="update-time">Hace 2 horas</p>
                            <p className="update-message">{update.mensaje}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button className="btn-ver-todas">Ver todas</button>
                  </div>
                )}

                {/* Cards de ayuda */}
                <div className="ayuda-grid">
                  <div className="ayuda-card emergencia">
                    <i className="fas fa-phone-alt"></i>
                    <h4>¿Necesitas ayuda?</h4>
                    <p>Recursos disponibles mientras esperamos</p>
                    <div className="recurso-item">
                      <i className="fas fa-phone"></i>
                      <div>
                        <strong>Línea de emergencia: 123</strong>
                        <small>Disponible 24/7 para crisis</small>
                      </div>
                    </div>
                    <div className="recurso-item">
                      <i className="fas fa-comments"></i>
                      <div>
                        <strong>Chat de apoyo psicológico</strong>
                        <small>Profesionales especializados</small>
                      </div>
                    </div>
                    <Link to="/ayuda" className="btn-recursos">
                      Acceder a recursos
                    </Link>
                  </div>

                  <div className="ayuda-card actualizaciones-info">
                    <i className="fas fa-bell"></i>
                    <h4>Actualizaciones</h4>
                    <p>Historial de notificaciones</p>
                    <div className="update-preview">
                      <i className="fas fa-clock"></i>
                      <span>Ayer, 3:45 PM</span>
                    </div>
                    <p className="update-text">Denuncia recibida y validada correctamente</p>
                    <button className="btn-ver-todas-link">Ver todas</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="consultar-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>VozSegura</h3>
              <p>Tu valentía genera el cambio • Denuncias con total confidencialidad</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Emergencias</h4>
                <a href="tel:123">Línea 123</a>
                <a href="#">Chat 24/7</a>
              </div>
              <div className="footer-column">
                <h4>Ayuda</h4>
                <Link to="/ayuda">Recursos</Link>
                <Link to="/login">Soporte</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>¿Preguntas? <a href="mailto:soporte@vozsegura.com">soporte@vozsegura.com</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ConsultarDenuncia;
