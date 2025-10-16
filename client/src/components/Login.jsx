import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para el formulario de login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  // Manejar login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(loginData.email, loginData.password);

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));

        // Redirigir según el rol
        if (data.usuario.rol === 'admin' || data.usuario.rol === 'docente') {
          navigate('/ver-datos');
        } else {
          navigate('/denuncia');
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error de conexión. Asegúrate de que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!registerData.fullName || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (registerData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!registerData.terms) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.registro(
        registerData.fullName,
        registerData.email,
        registerData.password,
        'estudiante'
      );

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/denuncia');
      } else {
        setError(data.message || 'Error al crear la cuenta');
      }
    } catch (err) {
      console.error('Error completo:', err);
      if (err.response) {
        // El servidor respondió con un código de error
        setError(err.response.data?.message || err.response.data?.error || 'Error al crear la cuenta');
      } else if (err.request) {
        // La petición se hizo pero no hubo respuesta
        setError('No se puede conectar al servidor. Verifica que esté corriendo en http://localhost:3000');
      } else {
        // Algo pasó al configurar la petición
        setError('Error al procesar la solicitud: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="header-simple">
        <div className="container">
          <Link to="/" className="nav-brand">
            <img src="/assets/logo-proyecto-web.jpeg" alt="VozSegura" />
            <h1>VozSegura</h1>
          </Link>
        </div>
      </header>

      <section className="login-section">
        <div className="container">
          <div className="login-container">
            <div className="login-form-wrapper">
              {!showRegister ? (
                // FORMULARIO DE LOGIN
                <div>
                  <div className="login-header">
                    <h2>iniciar sesion</h2>
                    <p>accede a tu cuenta de forma segura</p>
                  </div>

                  <form className="login-form" onSubmit={handleLogin}>
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                      <label htmlFor="email">correo institucional</label>
                      <div className="input-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input
                          type="email"
                          id="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          placeholder="tu.correo@universidad.edu.co"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">contraseña</label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="ingresa tu contraseña"
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="form-options">
                      <label className="checkbox-wrapper">
                        <input type="checkbox" id="remember" />
                        <span className="checkmark"></span>
                        recordarme
                      </label>
                      <a href="#" className="forgot-password">¿olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? 'Verificando...' : 'ingresar'}
                    </button>

                    <div className="divider">
                      <span>o</span>
                    </div>

                    <div className="register-option">
                      <p>¿no tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(true); setError(''); }}>registrarse</a></p>
                    </div>
                  </form>
                </div>
              ) : (
                // FORMULARIO DE REGISTRO
                <div>
                  <div className="login-header">
                    <h2>crear cuenta</h2>
                    <p>registrate para denunciar de forma segura</p>
                  </div>

                  <form className="login-form" onSubmit={handleRegister}>
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                      <label htmlFor="fullName">nombre completo</label>
                      <div className="input-wrapper">
                        <i className="fas fa-user"></i>
                        <input
                          type="text"
                          id="fullName"
                          value={registerData.fullName}
                          onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                          placeholder="tu nombre completo"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="emailRegister">correo institucional</label>
                      <div className="input-wrapper">
                        <i className="fas fa-envelope"></i>
                        <input
                          type="email"
                          id="emailRegister"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          placeholder="tu.correo@universidad.edu.co"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="passwordRegister">contraseña</label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          id="passwordRegister"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          placeholder="crea una contraseña segura"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">confirmar contraseña</label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock"></i>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                          placeholder="confirma tu contraseña"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-options">
                      <label className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={registerData.terms}
                          onChange={(e) => setRegisterData({ ...registerData, terms: e.target.checked })}
                          required
                        />
                        <span className="checkmark"></span>
                        acepto los <a href="#">terminos y condiciones</a>
                      </label>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? 'Creando cuenta...' : 'crear cuenta'}
                    </button>

                    <div className="register-option">
                      <p>¿ya tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); setShowRegister(false); setError(''); }}>iniciar sesion</a></p>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="login-info">
              <div className="info-card">
                <i className="fas fa-shield-alt"></i>
                <h3>seguridad garantizada</h3>
                <p>tus datos estan protegidos con encriptacion de alto nivel</p>
              </div>
              <div className="info-card">
                <i className="fas fa-user-secret"></i>
                <h3>confidencialidad</h3>
                <p>tu identidad permanece segura durante todo el proceso</p>
              </div>
              <div className="info-card">
                <i className="fas fa-headset"></i>
                <h3>soporte 24/7</h3>
                <p>ayuda disponible en cualquier momento que la necesites</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
