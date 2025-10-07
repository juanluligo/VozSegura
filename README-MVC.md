# VozSegura - Estructura MVC (Node.js + Express + MongoDB)

## 📁 Estructura del Proyecto

```
VozSegura/
├── server.js                    # Servidor Express - Punto de entrada
├── package.json                 # Dependencias y scripts de Node.js
├── .env                         # Variables de entorno (NO subir a Git)
├── .gitignore                   # Archivos ignorados por Git
├── models/                      # Modelos Mongoose (Esquemas de BD)
│   ├── Usuario.js              # Modelo de Usuario
│   └── Denuncia.js             # Modelo de Denuncia
├── controllers/                 # Controladores (Lógica de negocio)
│   ├── authController.js       # Controlador de autenticación
│   └── denunciaController.js   # Controlador de denuncias
├── routes/                      # Rutas de API REST
│   ├── auth.js                 # Rutas de autenticación
│   └── denuncias.js            # Rutas de denuncias
├── middleware/                  # Middlewares personalizados
│   └── auth.js                 # Middleware de autenticación JWT
├── views/                       # Vistas HTML (Frontend)
│   ├── home.html               # Página principal
│   ├── login.html              # Página de login/registro
│   ├── styles.css              # Estilos CSS
│   └── script.js               # JavaScript del frontend
├── public/                      # Archivos públicos estáticos
│   ├── css/                    # Estilos adicionales
│   ├── js/                     # Scripts adicionales
│   └── images/                 # Imágenes
├── config/                      # Configuración
│   └── database.sql            # Referencia del esquema (opcional)
└── assets/                      # Recursos del proyecto
    └── (imágenes del carrusel)
```

