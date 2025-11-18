import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, usuarioService } from '../services/api';
import './Usuarios.css';

function Usuarios() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalTipo, setModalTipo] = useState('crear'); // 'crear' o 'editar'
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'estudiante',
    activo: true
  });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await usuarioService.obtenerTodos();
      
      if (data.success) {
        setUsuarios(data.usuarios || []);
      } else {
        throw new Error(data.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError(err.response?.data?.message || err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const abrirModalCrear = () => {
    setModalTipo('crear');
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'estudiante',
      activo: true
    });
    setUsuarioEditando(null);
    setModalAbierto(true);
    setError('');
  };

  const abrirModalEditar = (usuario) => {
    setModalTipo('editar');
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol || 'estudiante',
      activo: usuario.activo
    });
    setUsuarioEditando(usuario);
    setModalAbierto(true);
    setError('');
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'estudiante',
      activo: true
    });
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (modalTipo === 'crear' && !formData.password) {
      setError('La contraseña es obligatoria para crear un usuario');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      let data;
      if (modalTipo === 'crear') {
        data = await usuarioService.crear(formData);
      } else {
        // Al editar, solo enviar password si se proporcionó uno nuevo
        const datosActualizar = {
          nombre: formData.nombre,
          email: formData.email,
          rol: formData.rol,
          activo: formData.activo
        };
        data = await usuarioService.actualizar(usuarioEditando.id, datosActualizar);
      }

      if (data.success) {
        await cargarUsuarios();
        cerrarModal();
        alert(modalTipo === 'crear' ? 'Usuario creado exitosamente' : 'Usuario actualizado exitosamente');
      } else {
        setError(data.message || 'Error al guardar el usuario');
      }
    } catch (err) {
      console.error('Error guardando usuario:', err);
      setError(err.response?.data?.message || err.message || 'Error al guardar el usuario');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarUsuario = async (usuario) => {
    if (!window.confirm(`¿Estás seguro de eliminar al usuario "${usuario.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const data = await usuarioService.eliminar(usuario.id);
      
      if (data.success) {
        await cargarUsuarios();
        alert('Usuario eliminado exitosamente');
      } else {
        alert(data.message || 'Error al eliminar el usuario');
      }
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      alert(err.response?.data?.message || err.message || 'Error al eliminar el usuario');
    }
  };

  const cambiarEstado = async (usuario) => {
    const nuevoEstado = !usuario.activo;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    if (!window.confirm(`¿Estás seguro de ${accion} al usuario "${usuario.nombre}"?`)) {
      return;
    }

    try {
      const data = await usuarioService.cambiarEstado(usuario.id, nuevoEstado);
      
      if (data.success) {
        await cargarUsuarios();
        alert(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`);
      } else {
        alert(data.message || 'Error al cambiar el estado');
      }
    } catch (err) {
      console.error('Error cambiando estado:', err);
      alert(err.response?.data?.message || err.message || 'Error al cambiar el estado');
    }
  };

  const obtenerNombreRol = (rol) => {
    const roles = {
      'admin': 'Administrador',
      'docente': 'Docente',
      'estudiante': 'Estudiante',
      'administrativo': 'Administrativo'
    };
    return roles[rol] || rol;
  };

  const usuariosActivos = usuarios.filter(u => u.activo);
  const usuariosInactivos = usuarios.filter(u => !u.activo);

  return (
    <div className="usuarios-page">
      <div className="container">
        {/* Header */}
        <div className="header-actions">
          <h1>
            <i className="fas fa-users"></i>
            Gestión de Usuarios
          </h1>
          <div className="header-buttons">
            <Link to="/dashboard" className="btn-dashboard">
              <i className="fas fa-chart-line"></i>
              Dashboard
            </Link>
            <Link to="/ver-datos" className="btn-dashboard">
              <i className="fas fa-database"></i>
              Ver Datos
            </Link>
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Acciones principales */}
        <div className="actions-bar">
          <button className="btn-crear" onClick={abrirModalCrear}>
            <i className="fas fa-user-plus"></i>
            Crear Nuevo Usuario
          </button>
          <button className="btn-refresh" onClick={cargarUsuarios}>
            <i className="fas fa-sync-alt"></i>
            Actualizar
          </button>
        </div>

        {loading && (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            Cargando usuarios...
          </div>
        )}

        {error && !modalAbierto && (
          <div className="alert-error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Estadísticas */}
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-users"></i>
                <div>
                  <div className="stat-number">{usuarios.length}</div>
                  <div className="stat-label">Total Usuarios</div>
                </div>
              </div>
              <div className="stat-card active">
                <i className="fas fa-user-check"></i>
                <div>
                  <div className="stat-number">{usuariosActivos.length}</div>
                  <div className="stat-label">Usuarios Activos</div>
                </div>
              </div>
              <div className="stat-card inactive">
                <i className="fas fa-user-times"></i>
                <div>
                  <div className="stat-number">{usuariosInactivos.length}</div>
                  <div className="stat-label">Usuarios Inactivos</div>
                </div>
              </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="section">
              <h2>Usuarios Registrados</h2>
              
              {usuarios.length === 0 ? (
                <div className="empty">No hay usuarios registrados</div>
              ) : (
                <div className="table-responsive">
                  <table className="usuarios-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className={!usuario.activo ? 'inactive-row' : ''}>
                          <td>{usuario.id}</td>
                          <td>
                            <div className="usuario-info">
                              <i className="fas fa-user-circle"></i>
                              {usuario.nombre}
                            </div>
                          </td>
                          <td>{usuario.email}</td>
                          <td>
                            <span className={`rol-badge ${usuario.rol}`}>
                              {obtenerNombreRol(usuario.rol)}
                            </span>
                          </td>
                          <td>
                            <span className={`estado-badge ${usuario.activo ? 'activo' : 'inactivo'}`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>{new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}</td>
                          <td>
                            <div className="acciones-btns">
                              <button
                                className="btn-accion editar"
                                onClick={() => abrirModalEditar(usuario)}
                                title="Editar"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                className="btn-accion estado"
                                onClick={() => cambiarEstado(usuario)}
                                title={usuario.activo ? 'Desactivar' : 'Activar'}
                              >
                                <i className={`fas fa-${usuario.activo ? 'ban' : 'check'}`}></i>
                              </button>
                              <button
                                className="btn-accion eliminar"
                                onClick={() => eliminarUsuario(usuario)}
                                title="Eliminar"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Modal Crear/Editar */}
        {modalAbierto && (
          <div className="modal-overlay" onClick={cerrarModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className={`fas fa-${modalTipo === 'crear' ? 'user-plus' : 'user-edit'}`}></i>
                  {modalTipo === 'crear' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
                </h3>
                <button className="btn-close" onClick={cerrarModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="nombre">
                      <i className="fas fa-user"></i>
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <i className="fas fa-envelope"></i>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">
                      <i className="fas fa-lock"></i>
                      Contraseña {modalTipo === 'crear' ? '*' : '(dejar vacío para no cambiar)'}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-control"
                      required={modalTipo === 'crear'}
                      minLength="6"
                      placeholder={modalTipo === 'editar' ? 'Dejar vacío para mantener la actual' : ''}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rol">
                      <i className="fas fa-user-tag"></i>
                      Rol *
                    </label>
                    <select
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="docente">Docente</option>
                      <option value="administrativo">Administrativo</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  {modalTipo === 'editar' && (
                    <div className="form-group checkbox-group">
                      <label htmlFor="activo">
                        <input
                          type="checkbox"
                          id="activo"
                          name="activo"
                          checked={formData.activo}
                          onChange={handleInputChange}
                        />
                        <span>Usuario Activo</span>
                      </label>
                    </div>
                  )}

                  {error && (
                    <div className="alert-error">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button 
                    type="button"
                    className="btn-secondary" 
                    onClick={cerrarModal}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        {modalTipo === 'crear' ? 'Crear Usuario' : 'Guardar Cambios'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Usuarios;
