import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  registro: async (nombre, email, password, rol = 'estudiante') => {
    try {
      console.log('🔵 Intentando registro:', { nombre, email, rol });
      const response = await api.post('/auth/registro', { nombre, email, password, rol });
      console.log('✅ Registro exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      console.error('Response:', error.response?.data);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getUsuarioActual: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Servicios de denuncias
export const denunciaService = {
  crear: async (denunciaData) => {
    const response = await api.post('/denuncias', denunciaData);
    return response.data;
  },

  obtenerTodas: async () => {
    const response = await api.get('/denuncias');
    return response.data;
  },

  obtenerPorCodigo: async (codigo) => {
    const response = await api.get(`/denuncias/${codigo}`);
    return response.data;
  },

  actualizar: async (id, datos) => {
    const response = await api.put(`/denuncias/${id}`, datos);
    return response.data;
  }
};

// Servicios de catálogo
export const catalogoService = {
  getFacultades: async () => {
    const response = await api.get('/catalogo/facultades');
    return response.data;
  },

  getInstituciones: async () => {
    const response = await api.get('/catalogo/instituciones');
    return response.data;
  }
};

export default api;
