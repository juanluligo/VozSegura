import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { denunciaService, authService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './Dashboard.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

function Dashboard() {
  const navigate = useNavigate();
  const [estadisticas, setEstadisticas] = useState(null);
  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const usuario = authService.getUsuarioActual();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      console.log('Dashboard - Cargando datos...');
      console.log('Token:', localStorage.getItem('token'));
      console.log('Usuario:', authService.getUsuarioActual());
      
      // Cargar estadísticas y denuncias en paralelo
      const [statsData, denunciasData] = await Promise.all([
        denunciaService.obtenerEstadisticas(),
        denunciaService.obtenerTodas()
      ]);

      console.log('Datos cargados:', { statsData, denunciasData });

      if (statsData.success) {
        setEstadisticas(statsData.estadisticas);
      }

      if (denunciasData.success) {
        setDenuncias(denunciasData.denuncias || []);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Preparar datos para gráfica de estados (Pie Chart)
  const getEstadosChartData = () => {
    const estadosCont = denuncias.reduce((acc, d) => {
      acc[d.estado] = (acc[d.estado] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: ['Recibida', 'En Revisión', 'En Proceso', 'Resuelta', 'Cerrada'],
      datasets: [
        {
          label: 'Denuncias por Estado',
          data: [
            estadosCont['recibida'] || 0,
            estadosCont['en_revision'] || 0,
            estadosCont['en_proceso'] || 0,
            estadosCont['resuelta'] || 0,
            estadosCont['cerrada'] || 0,
          ],
          backgroundColor: [
            'rgba(251, 191, 36, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(107, 114, 128, 0.8)',
          ],
          borderColor: [
            'rgb(251, 191, 36)',
            'rgb(59, 130, 246)',
            'rgb(139, 92, 246)',
            'rgb(16, 185, 129)',
            'rgb(107, 114, 128)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  // Preparar datos para gráfica de tipos (Bar Chart)
  const getTiposChartData = () => {
    const tiposCont = denuncias.reduce((acc, d) => {
      acc[d.tipo] = (acc[d.tipo] || 0) + 1;
      return acc;
    }, {});

    const sortedTipos = Object.entries(tiposCont)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      labels: sortedTipos.map(([tipo]) => tipo),
      datasets: [
        {
          label: 'Cantidad de Denuncias',
          data: sortedTipos.map(([, count]) => count),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgb(102, 126, 234)',
          borderWidth: 2,
        },
      ],
    };
  };

  // Preparar datos para gráfica de tendencia (Line Chart)
  const getTendenciaChartData = () => {
    const últimos6Meses = [];
    const hoy = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      últimos6Meses.push({
        mes: fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
        count: 0
      });
    }

    denuncias.forEach(d => {
      const fecha = new Date(d.fecha_creacion || d.fecha);
      const mesAño = fecha.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      const mesData = últimos6Meses.find(m => m.mes === mesAño);
      if (mesData) mesData.count++;
    });

    return {
      labels: últimos6Meses.map(m => m.mes),
      datasets: [
        {
          label: 'Denuncias Recibidas',
          data: últimos6Meses.map(m => m.count),
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-full">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <Link to="/" className="nav-brand">
          <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" />
            <h1>VozSegura</h1>
          </Link>
          <nav className="header-nav">
            <Link to="/ver-datos" className="nav-link">
              <i className="fas fa-database"></i>
              Ver Datos
            </Link>
            <Link to="/usuarios" className="nav-link">
              <i className="fas fa-users"></i>
              Usuarios
            </Link>
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
          {/* Título */}
          <div className="page-header">
            <div>
              <h1 className="page-title">
                <i className="fas fa-chart-line"></i>
                Dashboard Estadístico
              </h1>
              <p className="page-subtitle">Panel de control y análisis de denuncias</p>
            </div>
            <button onClick={cargarDatos} className="btn-refresh">
              <i className="fas fa-sync-alt"></i>
              Actualizar
            </button>
          </div>

          {error && (
            <div className="alert alert-error">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {/* KPIs Principales */}
          <div className="kpi-grid">
            <div className="kpi-card primary">
              <div className="kpi-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <div className="kpi-content">
                <h3>{estadisticas?.total_denuncias || denuncias.length}</h3>
                <p>Total Denuncias</p>
                <span className="kpi-trend positive">
                  <i className="fas fa-arrow-up"></i> +12% vs mes anterior
                </span>
              </div>
            </div>

            <div className="kpi-card warning">
              <div className="kpi-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="kpi-content">
                <h3>{denuncias.filter(d => d.estado === 'recibida').length}</h3>
                <p>Pendientes de Revisión</p>
                <span className="kpi-trend">
                  <i className="fas fa-clock"></i> Requieren atención
                </span>
              </div>
            </div>

            <div className="kpi-card info">
              <div className="kpi-icon">
                <i className="fas fa-spinner"></i>
              </div>
              <div className="kpi-content">
                <h3>{denuncias.filter(d => d.estado === 'en_proceso' || d.estado === 'en_revision').length}</h3>
                <p>En Proceso</p>
                <span className="kpi-trend">
                  <i className="fas fa-tasks"></i> En seguimiento
                </span>
              </div>
            </div>

            <div className="kpi-card success">
              <div className="kpi-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="kpi-content">
                <h3>{denuncias.filter(d => d.estado === 'resuelta').length}</h3>
                <p>Resueltas</p>
                <span className="kpi-trend positive">
                  <i className="fas fa-arrow-up"></i> +8% este mes
                </span>
              </div>
            </div>
          </div>

          {/* Gráficas */}
          <div className="charts-grid">
            {/* Gráfica de Estados - Pie */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>
                  <i className="fas fa-chart-pie"></i>
                  Distribución por Estado
                </h3>
                <span className="chart-badge">Tiempo real</span>
              </div>
              <div className="chart-body">
                <Pie data={getEstadosChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Gráfica de Tipos - Bar */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>
                  <i className="fas fa-chart-bar"></i>
                  Top Tipos de Denuncias
                </h3>
                <span className="chart-badge">Últimos 30 días</span>
              </div>
              <div className="chart-body">
                <Bar data={getTiposChartData()} options={chartOptions} />
              </div>
            </div>

            {/* Gráfica de Tendencia - Line */}
            <div className="chart-card full-width">
              <div className="chart-header">
                <h3>
                  <i className="fas fa-chart-line"></i>
                  Tendencia de Denuncias
                </h3>
                <span className="chart-badge">Últimos 6 meses</span>
              </div>
              <div className="chart-body">
                <Line data={getTendenciaChartData()} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Métricas Adicionales */}
          <div className="metrics-grid">
            <div className="metric-card">
              <i className="fas fa-hourglass-half"></i>
              <div>
                <h4>Tiempo Promedio de Resolución</h4>
                <p className="metric-value">12.5 días</p>
              </div>
            </div>

            <div className="metric-card">
              <i className="fas fa-users"></i>
              <div>
                <h4>Usuarios Activos</h4>
                <p className="metric-value">{estadisticas?.total_usuarios || 0}</p>
              </div>
            </div>

            <div className="metric-card">
              <i className="fas fa-building"></i>
              <div>
                <h4>Facultades Involucradas</h4>
                <p className="metric-value">{new Set(denuncias.map(d => d.facultad_id)).size}</p>
              </div>
            </div>

            <div className="metric-card">
              <i className="fas fa-percentage"></i>
              <div>
                <h4>Tasa de Resolución</h4>
                <p className="metric-value">
                  {denuncias.length > 0 
                    ? Math.round((denuncias.filter(d => d.estado === 'resuelta').length / denuncias.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Denuncias Recientes */}
          <div className="recent-section">
            <div className="section-header">
              <h2>
                <i className="fas fa-clock"></i>
                Denuncias Recientes
              </h2>
              <Link to="/ver-datos" className="btn-view-all">
                Ver todas
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="recent-table">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Gravedad</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {denuncias.slice(0, 5).map((denuncia) => (
                    <tr key={denuncia.id}>
                      <td>
                        <span className="codigo-badge">{denuncia.codigo}</span>
                      </td>
                      <td>{denuncia.tipo}</td>
                      <td>
                        <span className={`status-badge ${denuncia.estado}`}>
                          {denuncia.estado}
                        </span>
                      </td>
                      <td>
                        <span className={`gravedad-badge ${denuncia.gravedad}`}>
                          {denuncia.gravedad}
                        </span>
                      </td>
                      <td>{new Date(denuncia.fecha).toLocaleDateString('es-ES')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
