import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { denunciaService, catalogoService, authService } from '../services/api';
import './Denuncia.css';

function Denuncia() {
  const navigate = useNavigate();
  const [tipoSeleccionado, setTipoSeleccionado] = useState('Acoso verbal');
  const [facultades, setFacultades] = useState([]);
  const [loadingFacultades, setLoadingFacultades] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    facultad_id: '',
    gravedad: 'media'
  });

  const tipos = [
    { icon: 'fa-hand', label: 'Acoso verbal' },
    { icon: 'fa-user-shield', label: 'Acoso físico' },
    { icon: 'fa-laptop', label: 'Discriminación digital' },
    { icon: 'fa-user-slash', label: 'Exclusión social' }
  ];

  useEffect(() => {
    cargarFacultades();
  }, []);

  const cargarFacultades = async () => {
    setLoadingFacultades(true);
    try {
      const data = await catalogoService.getFacultades();
      const facultadesArray = data.facultades || data;
      if (Array.isArray(facultadesArray) && facultadesArray.length > 0) {
        setFacultades(facultadesArray);
      } else {
        console.warn('No se encontraron facultades');
      }
    } catch (err) {
      console.error('Error cargando facultades:', err);
      setError('Error al cargar facultades');
    } finally {
      setLoadingFacultades(false);
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validaciones
    if (!formData.descripcion || formData.descripcion.trim().length < 10) {
      setError('Por favor proporciona más detalles sobre el incidente (mínimo 10 caracteres).');
      return;
    }

    if (!formData.fecha) {
      setError('Por favor selecciona la fecha en que ocurrió el incidente.');
      return;
    }

    if (!formData.facultad_id) {
      setError('Por favor selecciona la facultad donde ocurrió el incidente.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const denunciaData = {
        tipo: tipoSeleccionado,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        gravedad: formData.gravedad,
        facultad_id: parseInt(formData.facultad_id),
        anonima: !token
      };

      const data = await denunciaService.crear(denunciaData);

      if (data.success) {
        alert(`✅ ¡Denuncia enviada exitosamente!\n\nCódigo de seguimiento: ${data.codigo}\n\n⚠️ GUARDA ESTE CÓDIGO para consultar el estado de tu denuncia.`);
        
        // Limpiar formulario
        setFormData({
          descripcion: '',
          fecha: new Date().toISOString().split('T')[0],
          facultad_id: '',
          gravedad: 'media'
        });
        setTipoSeleccionado('Acoso verbal');

        // Preguntar si quiere hacer otra denuncia
        const otraDenuncia = window.confirm('¿Deseas reportar otro incidente?');
        if (!otraDenuncia) {
          navigate('/');
        }
      } else {
        setError(data.message || 'Error al enviar la denuncia');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Asegúrate de que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="denuncia-page">
      <header className="header">
        <div className="logo">VozSegura</div>
        <nav>
          <a href="/">Inicio</a>
          <a href="#">Ayuda</a>
          <a href="#">Sobre</a>
          <a href="#" className="active">Procesar</a>
        </nav>
        <div className="user">
          <i className="fa-regular fa-user"></i>
          <button className="btn-salir" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main className="content">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        
        <h2>¿Qué ocurrió?</h2>
        <p className="subtitle">Cuéntanos sobre la situación. La información será protegida.</p>

        {error && <div className="form-error">{error}</div>}

        <section className="cards">
          {tipos.map((tipo) => (
            <div
              key={tipo.label}
              className={`card ${tipoSeleccionado === tipo.label ? 'active' : ''}`}
              onClick={() => setTipoSeleccionado(tipo.label)}
            >
              <i className={`fa-solid ${tipo.icon}`}></i>
              <p>{tipo.label}</p>
            </div>
          ))}
        </section>

        <section className="form-section">
          <label htmlFor="descripcion">Describe lo que ocurrió</label>
          <textarea
            id="descripcion"
            rows="4"
            placeholder="Escribe aquí los detalles del incidente..."
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          />

          <label htmlFor="fecha" style={{ marginTop: '20px' }}>¿Cuándo ocurrió?</label>
          <input
            type="date"
            id="fecha"
            value={formData.fecha}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', width: '100%' }}
          />

          <label htmlFor="facultad" style={{ marginTop: '20px' }}>Facultad donde ocurrió</label>
          <div style={{ position: 'relative' }}>
            <select
              id="facultad"
              value={formData.facultad_id}
              onChange={(e) => setFormData({ ...formData, facultad_id: e.target.value })}
              disabled={loadingFacultades}
              style={{ padding: '10px 40px 10px 10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', width: '100%' }}
            >
              <option value="">{loadingFacultades ? 'Cargando facultades...' : 'Selecciona una facultad...'}</option>
              {facultades.map((fac) => (
                <option key={fac.id} value={fac.id}>{fac.nombre}</option>
              ))}
            </select>
            {loadingFacultades && (
              <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <div className="spinner"></div>
              </div>
            )}
          </div>

          <label htmlFor="gravedad" style={{ marginTop: '20px' }}>Gravedad del incidente</label>
          <select
            id="gravedad"
            value={formData.gravedad}
            onChange={(e) => setFormData({ ...formData, gravedad: e.target.value })}
            style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1em', width: '100%' }}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </section>

        <section className="info-box">
          <p><strong>Tu información será protegida:</strong> Los datos se mantendrán confidenciales y sólo se usarán para procesos institucionales.</p>
        </section>

        <div className="buttons">
          <button className="cancel-btn" onClick={() => navigate('/')}>Cancelar</button>
          <button className="next-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : 'Siguiente paso'}
          </button>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 VozSegura - Desarrollado por estudiantes</p>
        <a href="#">Política de privacidad</a>
      </footer>
    </div>
  );
}

export default Denuncia;
