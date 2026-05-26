import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, denunciaService } from '../services/api';
import './VerDatos.css';

function VerDatos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [denuncias, setDenuncias] = useState([]);
  const [denunciaEditando, setDenunciaEditando] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentario, setComentario] = useState('');
  const [actualizando, setActualizando] = useState(false);
  const [archivosModal, setArchivosModal] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [cargandoArchivos, setCargandoArchivos] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('VerDatos - Cargando denuncias...');
      const data = await denunciaService.obtenerTodas();
      
      console.log('Denuncias cargadas:', data);

      if (data.success) {
        setDenuncias(data.denuncias || []);
      } else {
        throw new Error(data.message || 'Error al cargar denuncias');
      }
    } catch (err) {
      console.error('Error cargando denuncias:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const abrirModalEstado = (denuncia) => {
    setDenunciaEditando(denuncia);
    setNuevoEstado(denuncia.estado);
    setComentario('');
    setError('');
  };

  const cerrarModal = () => {
    setDenunciaEditando(null);
    setNuevoEstado('');
    setComentario('');
    setError('');
  };

  const actualizarEstado = async () => {
    if (!nuevoEstado) {
      setError('Por favor selecciona un estado');
      return;
    }

    setActualizando(true);
    setError('');

    try {
      const data = await denunciaService.actualizarEstado(
        denunciaEditando.id,
        nuevoEstado,
        comentario
      );

      if (data.success) {
        // Actualizar la lista de denuncias
        setDenuncias(denuncias.map(d => 
          d.id === denunciaEditando.id 
            ? { ...d, estado: nuevoEstado }
            : d
        ));

        cerrarModal();
        
        // Mostrar mensaje de éxito
        alert('Estado actualizado exitosamente. El usuario podrá ver este cambio al consultar su denuncia.');
      } else {
        setError(data.message || 'Error al actualizar el estado');
      }
    } catch (err) {
      console.error('Error actualizando estado:', err);
      setError('Error al actualizar el estado: ' + (err.response?.data?.message || err.message));
    } finally {
      setActualizando(false);
    }
  };

  const obtenerNombreEstado = (estado) => {
    const estados = {
      'recibida': 'Recibida',
      'en_revision': 'En Revisión',
      'en_proceso': 'En Proceso',
      'resuelta': 'Resuelta',
      'cerrada': 'Cerrada'
    };
    return estados[estado] || estado;
  };

  const verArchivos = async (denuncia) => {
    setArchivosModal(denuncia);
    setCargandoArchivos(true);
    setArchivos([]);

    try {
      const data = await denunciaService.obtenerArchivos(denuncia.id);
      if (data.success) {
        setArchivos(data.archivos || []);
      }
    } catch (err) {
      console.error('Error cargando archivos:', err);
      setError('Error al cargar archivos');
    } finally {
      setCargandoArchivos(false);
    }
  };

  const cerrarModalArchivos = () => {
    setArchivosModal(null);
    setArchivos([]);
  };

  const esImagen = (tipo) => {
    return tipo?.startsWith('image/');
  };

  const esVideo = (tipo) => {
    return tipo?.startsWith('video/');
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
            <Link to="/usuarios" className="btn-dashboard">
              <i className="fas fa-users"></i>
              Usuarios
            </Link>
            <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>

        <button className="btn-refresh" onClick={cargarDatos}>
          Actualizar Datos
        </button>

        {loading && <div className="loading">Cargando datos...</div>}

        {error && <div className="error">Error: {error}</div>}

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
                      <div className="item-header">
                        <div className="item-info">
                          <div className="item-content">
                            <strong>Denuncia #{index + 1}:</strong>{' '}
                            <span className="codigo">{denuncia.codigo}</span>
                          </div>
                          <div className="item-content">
                            <strong>Tipo:</strong> {denuncia.tipo}
                          </div>
                        </div>
                        <button 
                          className="btn-cambiar-estado"
                          onClick={() => abrirModalEstado(denuncia)}
                          title="Cambiar estado"
                        >
                          <i className="fas fa-edit"></i>
                          Cambiar Estado
                        </button>
                      </div>
                      <div className="item-content">
                        <strong>Descripción:</strong> {denuncia.descripcion}
                      </div>
                      <div className="item-content">
                        <strong>Estado:</strong>{' '}
                        <span className={`estado ${denuncia.estado}`}>
                          {obtenerNombreEstado(denuncia.estado)}
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
                      <div className="item-actions">
                        <button 
                          className="btn-ver-archivos"
                          onClick={() => verArchivos(denuncia)}
                          title="Ver archivos adjuntos"
                        >
                          <i className="fas fa-paperclip"></i>
                          Ver Evidencias
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Modal para ver archivos */}
        {archivosModal && (
          <div className="modal-overlay" onClick={cerrarModalArchivos}>
            <div className="modal-content modal-archivos" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="fas fa-paperclip"></i>
                  Evidencias de la Denuncia
                </h3>
                <button className="btn-close" onClick={cerrarModalArchivos}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="denuncia-info">
                  <p><strong>Código:</strong> {archivosModal.codigo}</p>
                  <p><strong>Tipo:</strong> {archivosModal.tipo}</p>
                </div>

                {cargandoArchivos ? (
                  <div className="loading-archivos">
                    <i className="fas fa-spinner fa-spin"></i>
                    Cargando archivos...
                  </div>
                ) : archivos.length === 0 ? (
                  <div className="empty-archivos">
                    <i className="fas fa-folder-open"></i>
                    <p>No hay archivos adjuntos en esta denuncia</p>
                  </div>
                ) : (
                  <div className="archivos-grid">
                    {archivos.map((archivo, idx) => (
                      <div key={idx} className="archivo-item">
                        {esImagen(archivo.tipo) ? (
                          <img 
                            src={`http://localhost:3000/${archivo.ruta.replace(/\\/g, '/')}`}
                            alt={archivo.nombre_original}
                            className="archivo-imagen"
                          />
                        ) : esVideo(archivo.tipo) ? (
                          <div className="archivo-video">
                            <video 
                              controls
                              className="video-player"
                              src={`http://localhost:3000/${archivo.ruta.replace(/\\/g, '/')}`}
                            >
                              Tu navegador no soporta el elemento de video.
                            </video>
                          </div>
                        ) : (
                          <div className="archivo-documento">
                            <i className="fas fa-file-pdf fa-3x"></i>
                            <p>{archivo.nombre_original}</p>
                          </div>
                        )}
                        <div className="archivo-info">
                          <p className="archivo-nombre">{archivo.nombre_original}</p>
                          <p className="archivo-fecha">
                            {new Date(archivo.fecha_subida).toLocaleString('es-ES')}
                          </p>
                          <a 
                            href={`http://localhost:3000/${archivo.ruta.replace(/\\/g, '/')}`}
                            download={archivo.nombre_original}
                            className="btn-descargar"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fas fa-download"></i>
                            Descargar
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={cerrarModalArchivos}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para cambiar estado */}
        {denunciaEditando && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="fas fa-sync-alt"></i>
                  Actualizar Estado de Denuncia
                </h3>
                <button className="btn-close" onClick={cerrarModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="modal-body">
                <div className="denuncia-info">
                  <p><strong>Código:</strong> {denunciaEditando.codigo}</p>
                  <p><strong>Tipo:</strong> {denunciaEditando.tipo}</p>
                  <p><strong>Estado actual:</strong> 
                    <span className={`estado ${denunciaEditando.estado}`}>
                      {obtenerNombreEstado(denunciaEditando.estado)}
                    </span>
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="nuevoEstado">
                    <i className="fas fa-tasks"></i>
                    Nuevo Estado *
                  </label>
                  <select
                    id="nuevoEstado"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                    className="form-control"
                  >
                    <option value="recibida">Recibida</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="resuelta">Resuelta</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="comentario">
                    <i className="fas fa-comment"></i>
                    Comentario o Nota (Opcional)
                  </label>
                  <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="form-control"
                    rows="4"
                    placeholder="Agrega notas sobre esta actualización..."
                  ></textarea>
                </div>

                {error && (
                  <div className="alert-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}

                <div className="estado-info-box">
                  <i className="fas fa-info-circle"></i>
                  <p>El usuario podrá ver este cambio al consultar su denuncia con el código de seguimiento.</p>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="btn-secondary" 
                  onClick={cerrarModal}
                  disabled={actualizando}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-primary" 
                  onClick={actualizarEstado}
                  disabled={actualizando}
                >
                  {actualizando ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      Actualizar Estado
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerDatos;
