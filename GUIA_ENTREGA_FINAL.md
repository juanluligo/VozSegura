# 🎓 VozSegura - Guía de Entrega Final

## 📋 Información del Proyecto

**Nombre:** VozSegura - Sistema de Denuncias Anónimas  
**Objetivo:** Plataforma web para la denuncia y seguimiento de casos de violencia en instituciones educativas  
**Tecnologías:** React + Express + MySQL  
**Estado:** ✅ 100% Funcional

---

## 🎯 Funcionalidades Implementadas

### ✅ **Sistema de Autenticación**
- ✓ Registro de usuarios (estudiantes, docentes, administrativos)
- ✓ Login seguro con JWT
- ✓ Roles (Usuario / Administrador)
- ✓ Protección de rutas privadas
- ✓ Sesiones persistentes

### ✅ **Gestión de Denuncias**
- ✓ Crear denuncia con código único automático
- ✓ Consulta pública por código (sin login)
- ✓ Ver mis denuncias (usuarios autenticados)
- ✓ Estados: Recibida → En Revisión → En Proceso → Resuelta → Cerrada
- ✓ Niveles de gravedad: Baja, Media, Alta
- ✓ Tipos de violencia: Acoso verbal, físico, psicológico, discriminación, etc.

### ✅ **Panel de Administración**
- ✓ Dashboard con estadísticas en tiempo real
- ✓ Gráficas interactivas (Chart.js):
  - Distribución por estado (Pie Chart)
  - Top tipos de denuncias (Bar Chart)
  - Tendencia temporal (Line Chart)
- ✓ Ver todas las denuncias
- ✓ Actualizar estados
- ✓ KPIs principales

### ✅ **Base de Datos**
- ✓ 12 tablas principales
- ✓ 6 vistas optimizadas
- ✓ 20 procedimientos almacenados
- ✓ Datos iniciales precargados:
  - 5 Instituciones educativas
  - 20 Facultades
  - 6 Recursos de ayuda
  - 1 Usuario administrador

### ✅ **Seguridad**
- ✓ Contraseñas hasheadas con bcrypt
- ✓ Autenticación JWT con expiración
- ✓ Middleware de autorización
- ✓ Prepared statements (protección SQL injection)
- ✓ CORS configurado
- ✓ Logs de auditoría

---

## 🚀 Instrucciones de Instalación

### Prerrequisitos
- Node.js v14+
- MySQL 8.0+
- npm o yarn

### Paso 1: Clonar/Abrir el proyecto
```powershell
cd "c:\Users\juanl\OneDrive\Escritorio\proyectos personales\VosSegura1.2\VosSegura1.2\VozSegura"
```

### Paso 2: Instalar dependencias
```powershell
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### Paso 3: Configurar Base de Datos
El archivo `.env` ya está configurado con:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1904
DB_NAME=vozsegura
DB_PORT=3306
```

### Paso 4: Crear Base de Datos
```powershell
node database/setup-database.js
```

### Paso 5: Verificar Conexión
```powershell
node database/test-connection.js
```

### Paso 6: Iniciar Servidor Backend
```powershell
npm start
```
Servidor corriendo en: **http://localhost:3000**

### Paso 7: Iniciar Frontend (Nueva terminal)
```powershell
cd client
npm run dev
```
Aplicación disponible en: **http://localhost:5173**

---

## 👤 Credenciales de Prueba

### Administrador
- **Email:** `admin@vozsegura.com`
- **Password:** `Admin123!`

### Usuario Regular (Crear nuevo)
Registrarse desde la interfaz o usar:
- **Email:** cualquier email válido
- **Password:** mínimo 6 caracteres

---

## 📊 Demostración del Sistema

### 1️⃣ **Vista Principal (Home)**
- Hero section atractivo
- Sección "Cómo funciona"
- Estadísticas de impacto
- Testimonios
- Recursos de ayuda
- Footer con información de contacto

### 2️⃣ **Crear Denuncia** 
```
Usuario autenticado → Botón "Reportar Incidente"
→ Seleccionar tipo de violencia
→ Describir situación
→ Seleccionar facultad
→ Nivel de gravedad
→ Fecha del incidente
→ Enviar → CÓDIGO ÚNICO generado
```

### 3️⃣ **Consultar Denuncia (Pública)**
```
No requiere login
→ Ingresar código de seguimiento
→ Ver estado actual
→ Timeline visual del proceso
→ Actualizaciones del caso
```

### 4️⃣ **Mis Denuncias (Usuario)**
```
Login → Mis Denuncias
→ Lista de todas mis denuncias
→ Códigos y estados
→ Opción de crear nueva
```

### 5️⃣ **Dashboard Admin**
```
Login como admin → Dashboard
→ 4 KPIs principales
→ 3 gráficas interactivas
→ Tabla de denuncias recientes
→ Métricas adicionales
```

### 6️⃣ **Ver Datos (Admin)**
```
Dashboard → Ver Datos
→ Lista completa de denuncias
→ Detalles: código, tipo, estado, gravedad
→ Posibilidad de filtrar (futuro)
```

---

## 🎨 Características Visuales

### Diseño UI/UX
- ✅ Diseño moderno y profesional
- ✅ Responsive (adaptable a móviles)
- ✅ Colores institucionales (azul/morado)
- ✅ Iconos Font Awesome
- ✅ Animaciones suaves
- ✅ Estados visuales claros (badges de colores)
- ✅ Gráficas interactivas

### Identidad Visual
- Logo institucional
- Paleta de colores coherente
- Tipografía legible
- Espaciado adecuado

---

## 🗂️ Estructura del Proyecto

```
VozSegura/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   │   ├── Home.jsx       # Página principal
│   │   │   ├── Login.jsx      # Login/Registro
│   │   │   ├── Denuncia.jsx   # Formulario denuncia
│   │   │   ├── ConsultarDenuncia.jsx
│   │   │   ├── MisDenuncias.jsx
│   │   │   ├── Dashboard.jsx   # Admin
│   │   │   └── VerDatos.jsx    # Admin
│   │   ├── services/
│   │   │   └── api.js         # Servicios HTTP
│   │   └── App.jsx            # Router principal
│   └── package.json
│
├── config/
│   └── database.js            # Configuración MySQL
│
├── controllers/               # Lógica de negocio
│   ├── authController.js
│   └── denunciaController.js
│
├── models/                    # Modelos de datos
│   ├── Usuario.js
│   ├── Denuncia.js
│   ├── Facultad.js
│   ├── Institucion.js
│   └── Recurso.js
│
├── routes/                    # Rutas API
│   ├── auth.js
│   ├── denuncias.js
│   └── catalogo.js
│
├── middleware/
│   └── auth.js                # Autenticación JWT
│
├── database/                  # Scripts BD
│   ├── schema.sql             # Estructura completa
│   ├── setup-database.js      # Instalación automática
│   ├── test-connection.js     # Pruebas
│   └── ver-datos.js           # Visualizar datos
│
├── .env                       # Variables de entorno
├── server.js                  # Servidor Express
├── package.json
└── README.md
```

---

## 📡 API Endpoints Principales

### Autenticación
```
POST /api/auth/registro        # Registrar usuario
POST /api/auth/login           # Login usuario
POST /api/auth/admin/login     # Login admin
```

### Denuncias
```
POST   /api/denuncias                    # Crear denuncia
GET    /api/denuncias                    # Todas (admin)
GET    /api/denuncias/mis-denuncias      # Mis denuncias
GET    /api/denuncias/consultar/:codigo  # Consultar por código
PUT    /api/denuncias/:id/estado         # Actualizar estado (admin)
GET    /api/denuncias/estadisticas/general # Estadísticas (admin)
```

### Catálogo
```
GET /api/catalogo/instituciones   # Listar instituciones
GET /api/catalogo/facultades      # Listar facultades
GET /api/catalogo/recursos        # Recursos de ayuda
```

---

## 🧪 Casos de Prueba

### Test 1: Registro de Usuario
1. Ir a http://localhost:5173
2. Click en "Iniciar Sesión"
3. Click en "Crear Cuenta"
4. Llenar formulario
5. ✅ Usuario registrado, redirige a mis denuncias

### Test 2: Crear Denuncia
1. Login como usuario
2. Click "Reportar Incidente"
3. Llenar formulario completo
4. ✅ Código generado, denuncia guardada

### Test 3: Consultar Denuncia
1. Desde home, "Consultar Estado"
2. Ingresar código obtenido
3. ✅ Ver timeline y estado actual

### Test 4: Dashboard Admin
1. Login con admin@vozsegura.com / Admin123!
2. ✅ Ver estadísticas y gráficas
3. Click "Ver Datos"
4. ✅ Ver lista completa de denuncias

---

## ✅ Checklist de Entrega

- [x] Sistema completamente funcional
- [x] Base de datos configurada y poblada
- [x] Frontend React completamente migrado
- [x] Backend Express con API REST
- [x] Autenticación y autorización
- [x] Panel administrativo con gráficas
- [x] Diseño responsive y atractivo
- [x] Documentación completa
- [x] Scripts de instalación automatizados
- [x] Datos de prueba precargados
- [x] Código limpio y comentado
- [x] Sin errores en consola

---

## 🎬 Script para Presentación

### Introducción (1-2 min)
"VozSegura es una plataforma web diseñada para facilitar la denuncia anónima y el seguimiento de casos de violencia en instituciones educativas. El sistema garantiza confidencialidad y proporciona herramientas de gestión para los administradores."

### Demostración (5-7 min)

**1. Vista Principal**
- Mostrar diseño atractivo y profesional
- Resaltar la facilidad de navegación

**2. Flujo Usuario**
- Registro rápido
- Crear denuncia
- Mostrar código generado
- Consultar estado sin login
- Ver mis denuncias

**3. Flujo Administrador**
- Login como admin
- Dashboard con métricas en tiempo real
- Gráficas interactivas
- Ver datos completos
- Explicar posibilidad de cambiar estados

**4. Base de Datos**
- Mostrar estructura en MySQL Workbench
- Procedimientos almacenados
- Datos precargados

### Tecnologías (1-2 min)
- **Frontend:** React 19, React Router, Chart.js, Axios
- **Backend:** Node.js, Express, JWT, Bcrypt
- **Base de Datos:** MySQL con procedimientos almacenados
- **Herramientas:** Vite, dotenv, CORS

### Conclusión (1 min)
"El sistema está 100% funcional, con todas las características solicitadas implementadas. Es escalable, seguro y fácil de usar tanto para usuarios como administradores."

---

## 🔍 Puntos Destacables

### Fortalezas Técnicas
1. **Arquitectura MVC** bien estructurada
2. **Procedimientos almacenados** para operaciones complejas
3. **Vistas de BD** para optimizar consultas
4. **JWT** para autenticación segura
5. **React moderno** con hooks
6. **Responsive design** funcional en móviles
7. **Gráficas interactivas** para visualización de datos

### Seguridad
- Contraseñas hasheadas
- Tokens con expiración
- Protección contra SQL injection
- Validaciones en frontend y backend
- Middleware de autorización

### Escalabilidad
- Código modular y reutilizable
- API REST bien diseñada
- Base de datos normalizada
- Fácil de mantener y extender

---

## 📞 Soporte y Contacto

Para cualquier duda durante la presentación:
- Documentación completa en `README.md`
- API docs en `API-DOCS.md`
- Scripts de prueba en carpeta `database/`

---

## 🎉 Conclusión

**VozSegura está listo para la entrega final.**

El proyecto cumple con todos los requisitos:
- ✅ Sistema web funcional
- ✅ Frontend moderno y atractivo
- ✅ Backend robusto y seguro
- ✅ Base de datos bien diseñada
- ✅ Documentación completa
- ✅ Fácil instalación y uso

**¡Éxito en la presentación! 🚀**
