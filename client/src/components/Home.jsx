import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;

  // Auto-slide del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const slides = [
    {
      image: '/assets/imagen-de-seguridad.jpg',
      title: 'Un Espacio Seguro para Todos',
      description: 'Promoviendo ambientes educativos libres de violencia'
    },
    {
      image: '/assets/cybersecurity.jpg',
      title: 'Confidencialidad Garantizada',
      description: 'Tu identidad está protegida en todo momento'
    },
    {
      image: '/assets/diversidad-e-inclusion.jpg',
      title: 'Diversidad e Inclusión',
      description: 'Respetamos y protegemos a toda nuestra comunidad'
    },
    {
      image: '/assets/apoyo.jpg',
      title: 'Apoyo Profesional 24/7',
      description: 'Equipo especializado listo para ayudarte'
    }
  ];

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <div className="nav-brand">
            <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" />
            <h1>VozSegura</h1>
          </div>
          <nav className="nav-menu">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#como-funciona" className="nav-link">Cómo Funciona</a>
            <a href="#recursos" className="nav-link">Recursos</a>
            <Link to="/login" className="btn-login">Ingresar</Link>
          </nav>
        </div>
      </header>

      {/* Carrusel */}
      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-wrapper">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`carousel-slide slide-${index + 1} ${currentSlide === index ? 'active' : ''}`}
              >
                <img src={slide.image} alt={slide.title} />
                <div className="carousel-caption">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-btn prev" onClick={prevSlide}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </section>

      {/* Hero */}
      <section id="inicio" className="hero">
        <div className="container">
          <div className="hero-content">
            <h2>Tu Voz Importa</h2>
            <p>Plataforma segura para denunciar violencia de género<br />de forma anónima en tu institución educativa</p>

            <div className="hero-circle">
              <div className="people-icons">
                <i className="fas fa-user-circle user-icon red"></i>
                <i className="fas fa-user-circle user-icon green"></i>
                <i className="fas fa-user-circle user-icon blue"></i>
                <i className="fas fa-user-circle user-icon orange"></i>
                <i className="fas fa-user-circle user-icon purple"></i>
                <i className="fas fa-user-circle user-icon teal"></i>
              </div>
              <div className="circle-text">
                Diversidad • Inclusión • Protección
              </div>
            </div>

            <div className="hero-buttons">
              <Link to="/login" className="btn btn-primary btn-lock">
                <i className="fas fa-lock"></i> Hacer Denuncia Anónima
              </Link>
              <a href="#recursos" className="btn btn-secondary-hero">
                <i className="fas fa-comment"></i> Necesito Ayuda Ahora
              </a>
              <div className="consult-link">
                <a href="#consulta" className="link-consult">
                  <i className="fas fa-search"></i> Consultar Estado de mi Denuncia
                </a>
              </div>
            </div>

            <div className="hero-tags">
              <span className="tag"><i className="fas fa-check"></i> 100% Anónimo</span>
              <span className="tag"><i className="fas fa-check"></i> Seguro</span>
              <span className="tag"><i className="fas fa-check"></i> Confidencial</span>
              <span className="tag"><i className="fas fa-check"></i> 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="como-funciona" className="features">
        <div className="container">
          <h2>Cómo Funciona VozSegura</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-user-shield"></i>
              <h3>Denuncia Segura</h3>
              <p>Registra tu denuncia de forma confidencial y segura</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-search"></i>
              <h3>Seguimiento</h3>
              <p>Consulta el estado de tu caso en tiempo real</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-hands-helping"></i>
              <h3>Apoyo Integral</h3>
              <p>Accede a recursos de ayuda psicológica y legal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué usar */}
      <section id="por-que-usar" className="why-use">
        <div className="container">
          <h2>¿Por Qué Usar VozSegura?</h2>
          <p>Tu seguridad y bienestar son nuestra prioridad</p>
          <div className="why-use-grid">
            <div className="why-card">
              <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" className="card-logo" />
              <h3>Sin Miedo</h3>
              <p>Denuncia sin temor a represalias con total protección</p>
            </div>
            <div className="why-card">
              <i className="fas fa-clock"></i>
              <h3>Respuesta Rápida</h3>
              <p>Atención inmediata a tu caso las 24 horas del día</p>
            </div>
            <div className="why-card">
              <i className="fas fa-user-tie"></i>
              <h3>Apoyo Profesional</h3>
              <p>Equipo especializado en atención psicológica y legal</p>
            </div>
            <div className="why-card">
              <i className="fas fa-universal-access"></i>
              <h3>Accesible</h3>
              <p>Plataforma fácil de usar desde cualquier dispositivo</p>
            </div>
            <div className="why-card">
              <i className="fas fa-user-secret"></i>
              <h3>Privacidad Total</h3>
              <p>Tu identidad permanece completamente protegida</p>
            </div>
            <div className="why-card">
              <i className="fas fa-chart-line"></i>
              <h3>Impacto Real</h3>
              <p>Genera cambios positivos en tu comunidad educativa</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="recursos" className="resources">
        <div className="container">
          <h2>Recursos de Ayuda</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <i className="fas fa-brain"></i>
              <h3>Apoyo Psicológico</h3>
              <p>Guías y contactos para apoyo emocional</p>
            </div>
            <div className="resource-card">
              <i className="fas fa-balance-scale"></i>
              <h3>Asesoría Legal</h3>
              <p>Orientación jurídica gratuita</p>
            </div>
            <div className="resource-card">
              <i className="fas fa-phone"></i>
              <h3>Líneas de Emergencia</h3>
              <p>Contactos de emergencia 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impacto" className="impact">
        <div className="container">
          <h2>Nuestro Impacto</h2>
          <p>Hacemos la diferencia en comunidades educativas</p>
          <div className="impact-stats">
            <div className="stat-circle">
              <div className="stat-number">+500</div>
              <div className="stat-label">Casos Atendidos</div>
            </div>
            <div className="stat-circle">
              <div className="stat-number">100%</div>
              <div className="stat-label">Confidencialidad</div>
            </div>
            <div className="stat-circle">
              <div className="stat-number">-24h</div>
              <div className="stat-label">Respuesta</div>
            </div>
            <div className="stat-circle">
              <div className="stat-number">95%</div>
              <div className="stat-label">Satisfacción</div>
            </div>
            <div className="stat-circle">
              <div className="stat-number">+50</div>
              <div className="stat-label">Instituciones</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="container">
          <h2>¿Listo/a para Actuar?</h2>
          <p>No esperes más, tu voz puede marcar la diferencia</p>
          <Link to="/login" className="btn btn-primary btn-large">Hacer mi Denuncia Ahora</Link>
          <div className="cta-links">
            <a href="#recursos" className="cta-link">Línea de Ayuda</a>
            <a href="#como-funciona" className="cta-link">Más Información</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" className="footer-logo" />
              <h3>VozSegura</h3>
              <p>Protegiendo tu bienestar y promoviendo ambientes seguros</p>
            </div>
            <div className="footer-links">
              <h4>Enlaces</h4>
              <a href="#inicio">Inicio</a>
              <a href="#como-funciona">Cómo Funciona</a>
              <a href="#recursos">Recursos</a>
              <Link to="/login">Ingresar</Link>
            </div>
            <div className="footer-contact">
              <h4>Contacto</h4>
              <p><i className="fas fa-envelope"></i> ayuda@vozsegura.com</p>
              <p><i className="fas fa-phone"></i> Línea de Ayuda: 123</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 VozSegura. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
