# 🎯 VozSegura - Sistema de Denuncias

**Plataforma web completa para gestión de denuncias universitarias con sistema de seguimiento, atenciones y recursos de ayuda.**

> 📚 **¿Necesitas integrar VozSegura con Moodle?** Consulta la [Guía de Integración con Moodle](GUIA_MOODLE_INTEGRACION.md)

## 📋 Descripción

VozSegura es una aplicación full-stack que permite a usuarios realizar denuncias de manera segura y confidencial, con soporte para denuncias anónimas. Los administradores pueden gestionar, dar seguimiento y asignar recursos de ayuda a cada caso.

### 🛠️ Tecnologías

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Base de Datos:** MySQL 8.0
- **Autenticación:** JWT (JSON Web Tokens)
- **Seguridad:** Bcrypt, CORS, Helmet

### ✨ Características Principales

✅ **Registro y autenticación** de usuarios y administradores  
✅ **Denuncias con código único** y seguimiento completo  
✅ **Denuncias anónimas** disponibles  
✅ **Dashboard administrativo** con estadísticas en tiempo real  
✅ **Atenciones profesionales** (psicológica, legal, social)  
✅ **Recursos de ayuda** asignables a denuncias  
✅ **Historial de seguimiento** detallado  
✅ **Base de datos optimizada** con vistas y procedimientos almacenados  

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js** v16 o superior
- **MySQL** 8.0 o superior
- **npm** o **yarn**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/juanluligo/VozSegura.git
cd VozSegura
```

### Paso 2: Instalar Dependencias

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
cd ..
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=vozsegura
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_segura_aqui
JWT_EXPIRES_IN=7d

# Servidor
PORT=3000
NODE_ENV=development
```

### Paso 4: Configurar la Base de Datos

#### Opción A: Script Automático (Recomendado)
```bash
node database/setup-database.js
```

#### Opción B: Importar SQL Manualmente
```bash
mysql -u root -p < config/script.sql
```

**El script crea:**
- 12 tablas relacionadas
- Datos de prueba (instituciones, facultades, recursos)
- 1 administrador por defecto
- 50+ vistas optimizadas
- 40+ procedimientos almacenados
- Triggers de auditoría

### Paso 5: Verificar Conexión

```bash
node database/test-connection.js
```

---

## ▶️ Iniciar la Aplicación

### Desarrollo

#### Iniciar Backend y Frontend (Automático)
```bash
npm start
```

Esto iniciará:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

#### Iniciar por Separado

**Backend:**
```bash
node server.js
```

**Frontend:**
```bash
cd client
npm run dev
```

### Producción

**Backend:**
```bash
npm run start:prod
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

---

## 👥 Cómo Usar la Aplicación

### Para Usuarios

#### 1. Registro
1. Accede a http://localhost:5173
2. Haz clic en **"Registrarse"**
3. Completa el formulario con tu nombre, email y contraseña
4. Inicia sesión con tus credenciales

#### 2. Crear una Denuncia
1. Inicia sesión
2. Selecciona **"Nueva Denuncia"** en el menú
3. Completa el formulario:
   - Tipo de denuncia (acoso, discriminación, violencia, etc.)
   - Descripción detallada
   - Fecha del incidente
   - Nivel de gravedad
   - Institución y facultad
4. Opcionalmente adjunta archivos de evidencia
5. Envía la denuncia - recibirás un **código único**

#### 3. Consultar una Denuncia
1. Selecciona **"Consultar Denuncia"**
2. Ingresa tu código único
3. Visualiza:
   - Estado actual
   - Historial de seguimiento
   - Recursos de ayuda asignados
   - Comentarios del administrador

#### 4. Ver Mis Denuncias
- Accede a **"Mis Denuncias"** para ver todas tus denuncias
- Consulta el estado y seguimiento de cada una

#### 5. Denuncia Anónima
- Puedes crear denuncias sin registrarte
- Guarda el código que se te proporciona para dar seguimiento

### Para Administradores

#### Credenciales por Defecto
- **Email:** `admin@vozsegura.com`
- **Password:** `Admin123!`

#### 1. Acceso al Dashboard
1. Inicia sesión con credenciales de administrador
2. Accede al **Dashboard Administrativo**
3. Visualiza estadísticas en tiempo real:
   - Total de denuncias
   - Denuncias por estado
   - Casos urgentes
   - Tendencias mensuales

#### 2. Gestionar Denuncias
1. Ve a **"Gestión de Denuncias"**
2. Filtra por estado, tipo o gravedad
3. Selecciona una denuncia para:
   - Ver detalles completos
   - Cambiar estado (recibida → en proceso → resuelta)
   - Agregar comentarios de seguimiento
   - Asignar recursos de ayuda
   - Cambiar nivel de gravedad

#### 3. Registrar Atenciones
1. Abre una denuncia
2. Registra atenciones profesionales:
   - Tipo: psicológica, legal, social
   - Descripción de la sesión
   - Fecha y hora

#### 4. Gestionar Usuarios
- Ve a **"Usuarios"**
- Visualiza todos los usuarios registrados
- Activa/desactiva cuentas
- Consulta historial de denuncias por usuario

#### 5. Asignar Recursos
- Asigna recursos de ayuda disponibles:
  - Líneas de ayuda
  - Guías psicológicas
  - Asesoría legal
  - Contactos de emergencia

---

## 🔑 Credenciales de Prueba

### Administrador
- **Email:** `admin@vozsegura.com`
- **Password:** `Admin123!`

### Usuarios de Prueba (si ejecutaste datos demo)
- **Usuario 1:** `ana@correo.com` / `pass1`
- **Usuario 2:** `carlos@correo.com` / `pass2`

---

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Login usuario
- `POST /api/auth/admin/login` - Login administrador

### Denuncias
- `POST /api/denuncias` - Crear denuncia
- `GET /api/denuncias/mis-denuncias` - Mis denuncias (requiere auth)
- `GET /api/denuncias/consultar/:codigo` - Consultar por código
- `GET /api/denuncias` - Todas las denuncias (admin)
- `PUT /api/denuncias/:id/estado` - Actualizar estado (admin)
- `POST /api/denuncias/:id/seguimiento` - Agregar seguimiento (admin)

### Catálogo
- `GET /api/catalogo/instituciones` - Listar instituciones
- `GET /api/catalogo/facultades` - Listar facultades
- `GET /api/catalogo/facultades/:institucionId` - Facultades por institución
- `GET /api/catalogo/recursos` - Recursos de ayuda

### Usuarios (Admin)
- `GET /api/usuarios` - Listar todos los usuarios
- `PUT /api/usuarios/:id/activo` - Activar/desactivar usuario

---

## 📊 Base de Datos

### Tablas Principales (12)
- `usuarios` - Usuarios del sistema
- `administradores` - Administradores
- `denuncias` - Denuncias registradas
- `instituciones` - Instituciones educativas
- `facultades` - Facultades por institución
- `recursos` - Recursos de ayuda
- `archivos` - Archivos adjuntos
- `seguimiento_denuncia` - Historial de seguimiento
- `atenciones` - Atenciones profesionales
- `log_accion` - Auditoría del sistema
- `orientacion` - Mensajes a usuarios
- `denuncia_recurso` - Relación denuncias-recursos

### Procedimientos Almacenados (40+)
- CRUD completo para todas las entidades
- Procedimientos de búsqueda avanzada
- Generación de reportes y estadísticas
- Procedimientos de mantenimiento

### Vistas (50+)
- Análisis temporal (por mes, trimestre, semana)
- Análisis por tipo y gravedad
- Estadísticas por institución y facultad
- Rendimiento de administradores
- Indicadores de desempeño

---

## 📁 Estructura del Proyecto

```
VozSegura/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── services/       # API services
│   │   └── App.jsx         # App principal
│   ├── public/
│   └── package.json
├── config/
│   ├── database.js         # Conexión MySQL
│   └── script.sql          # Script completo SQL
├── models/                 # Modelos de datos
├── controllers/            # Lógica de negocio
├── routes/                 # Rutas API
├── middleware/             # Autenticación JWT
├── database/               # Scripts de setup
├── uploads/                # Archivos subidos
├── .env                    # Configuración
├── server.js               # Servidor Express
└── package.json
```

---

## 🔧 Solución de Problemas

### Error de Conexión MySQL

**Windows:**
```powershell
# Verificar servicio
Get-Service MySQL*

# Reiniciar si es necesario
Restart-Service MySQL
```

**Linux/Mac:**
```bash
# Verificar estado
sudo systemctl status mysql

# Reiniciar
sudo systemctl restart mysql
```

### Tablas No Existen
```bash
node database/setup-database.js
```

### Módulos No Encontrados
```bash
npm install
cd client
npm install
```

### Puerto en Uso
Cambia el puerto en `.env`:
```env
PORT=3001
```

### Error de CORS
Verifica que el frontend esté en la lista de orígenes permitidos en `server.js`

---

## 🔐 Seguridad

- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ Prepared statements (protección SQL injection)
- ✅ Middleware de autenticación y autorización
- ✅ Validación de datos en backend
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Logs de auditoría automáticos

---

## 📝 Datos Iniciales

Al ejecutar el setup de base de datos, se crean:

- ✅ 5 Instituciones educativas
- ✅ 9 Facultades
- ✅ 6 Recursos de ayuda (líneas, sitios web)
- ✅ 1 Administrador por defecto
- ✅ Datos de prueba opcionales (usuarios y denuncias)

---

## 🤝 Contribuir

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 👨‍💻 Autor

**Juan Luis**
- GitHub: [@juanluligo](https://github.com/juanluligo)

---

## 📞 Soporte

Si tienes algún problema o pregunta:
1. Revisa la sección de **Solución de Problemas**
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que MySQL esté corriendo
4. Revisa los logs del servidor para más detalles

---

## 🎯 Roadmap

- [ ] Sistema de notificaciones en tiempo real
- [ ] Exportación de reportes en PDF
- [ ] Chat en vivo entre usuario y administrador
- [ ] App móvil con React Native
- [ ] Dashboard con gráficos avanzados
- [ ] Sistema de roles más granular
- [ ] Integración con sistemas de email

---

## 🎓 Integración con Moodle

¿Tu institución utiliza Moodle? VozSegura puede integrarse perfectamente con tu plataforma LMS. 

👉 **[Ver Guía Completa de Integración con Moodle](GUIA_MOODLE_INTEGRACION.md)**

La guía incluye:
- ✅ Instalación y configuración de Moodle desde cero
- ✅ 3 opciones de integración (enlace externo, plugin, SSO)
- ✅ Configuración de Single Sign-On (SSO) con JWT
- ✅ Scripts de mantenimiento y backup
- ✅ Casos de uso y mejores prácticas
- ✅ Soporte técnico y solución de problemas

---

**¡Gracias por usar VozSegura! 💙**
