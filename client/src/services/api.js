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
    console.log('Error en API:', error.response?.status, error.response?.data);
    console.log('Error completo:', error);
    console.log('URL que falló:', error.config?.url);
    console.log('Headers enviados:', error.config?.headers);
    
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      console.log('Error 401 - Token inválido');
      console.log('Mensaje del servidor:', error.response.data);
      // COMENTADO TEMPORALMENTE PARA DEBUG
      // localStorage.removeItem('token');
      // localStorage.removeItem('usuario');
      // window.location.href = '/login';
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
      console.log('Intentando registro:', { nombre, email, rol });
      const response = await api.post('/auth/registro', { nombre, email, password, rol });
      console.log('Registro exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
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

  crearConArchivos: async (denunciaData, archivos) => {
    const formData = new FormData();
    
    // Agregar datos de la denuncia
    formData.append('tipo', denunciaData.tipo);
    formData.append('descripcion', denunciaData.descripcion);
    formData.append('fecha', denunciaData.fecha);
    formData.append('gravedad', denunciaData.gravedad);
    formData.append('facultad_id', denunciaData.facultad_id);
    
    // Agregar archivos
    if (archivos && archivos.length > 0) {
      for (let i = 0; i < archivos.length; i++) {
        formData.append('archivos', archivos[i]);
      }
    }

    const response = await api.post('/denuncias', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  obtenerTodas: async () => {
    const response = await api.get('/denuncias/todas');
    return response.data;
  },

  obtenerArchivos: async (denunciaId) => {
    const response = await api.get(`/denuncias/${denunciaId}/archivos`);
    return response.data;
  },

  consultarPorCodigo: async (codigo) => {
    const response = await api.get(`/denuncias/consultar/${codigo}`);
    return response.data;
  },

  misDenuncias: async () => {
    const response = await api.get('/denuncias/mis-denuncias');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/denuncias/${id}`);
    return response.data;
  },

  actualizar: async (id, datos) => {
    const response = await api.put(`/denuncias/${id}`, datos);
    return response.data;
  },

  actualizarEstado: async (id, estado, comentario = '') => {
    const response = await api.put(`/denuncias/${id}/estado`, { estado, comentario });
    return response.data;
  },

  obtenerEstadisticas: async () => {
    const response = await api.get('/denuncias/estadisticas/general');
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

// Servicios de usuarios (Admin)
export const usuarioService = {
  obtenerTodos: async () => {
    const response = await api.get('/auth/usuarios');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/auth/usuarios/${id}`);
    return response.data;
  },

  crear: async (usuarioData) => {
    const response = await api.post('/auth/usuarios', usuarioData);
    return response.data;
  },

  actualizar: async (id, usuarioData) => {
    const response = await api.put(`/auth/usuarios/${id}`, usuarioData);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/auth/usuarios/${id}`);
    return response.data;
  },

  cambiarEstado: async (id, activo) => {
    const response = await api.patch(`/auth/usuarios/${id}/estado`, { activo });
    return response.data;
  }
};

export default api;
