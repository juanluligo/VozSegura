# 🎯 VozSegura - Sistema de Denuncias

Plataforma completa de denuncias con **React + Express + MySQL**, autenticación JWT y gestión administrativa.


**El frontend ha sido completamente migrado a React** manteniendo toda la funcionalidad original.

- 🚀 **Frontend:** React con Vite
- 🟢 **Backend:** Express + Node.js
- 🗄️ **Base de Datos:** MySQL

## ✅ Sistema Completamente Funcional

### 🚀 Características Principales

✅ **Registro y Login** de usuarios y administradores  
✅ **Sistema de denuncias** con código único automático  
✅ **Seguimiento completo** de denuncias con historial  
✅ **Atenciones** (psicológica, legal, social)  
✅ **Recursos de ayuda** asignables a denuncias  
✅ **Estadísticas** en tiempo real  
✅ **Procedimientos almacenados** y vistas optimizadas  

---

## � Inicio Rápido

### 1. Configurar Base de Datos MySQL

**Actualiza tu contraseña en `.env`:**
```env
DB_PASSWORD=tu_contraseña_mysql
```

**Ejecuta el script SQL:**
```powershell
# Opción 1: Setup automático
node database/setup-database.js

# Opción 2: Manual
mysql -u root -p < database/schema.sql
```

### 2. Probar Conexión

```powershell
node database/test-connection.js
```

### 3. Iniciar Servidor

```powershell
npm start
```

Abre: http://localhost:3000

---

## 🔑 Credenciales Iniciales

**Administrador:**
- Email: `admin@vozsegura.com`
- Password: `Admin123!`


---

## 🧪 Pruebas Rápidas (PowerShell)

### 1. Registrar Usuario
```powershell
$body = @{
    nombre = "Juan Pérez"
    email = "juan@ejemplo.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/registro" -Method POST -Body $body -ContentType "application/json"
$token = $response.token
```

### 2. Crear Denuncia
```powershell
$headers = @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" }
$denuncia = @{
    tipo = "Acoso verbal"
    descripcion = "Descripción de la denuncia"
    fecha = "2024-10-14"
    gravedad = "media"
    facultad_id = 1
} | ConvertTo-Json

$res = Invoke-RestMethod -Uri "http://localhost:3000/api/denuncias" -Method POST -Headers $headers -Body $denuncia
Write-Host "Código: $($res.codigo)"
```

### 3. Login Admin
```powershell
$body = @{
    email = "admin@vozsegura.com"
    password = "Admin123!"
} | ConvertTo-Json

$admin = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/admin/login" -Method POST -Body $body -ContentType "application/json"
$adminToken = $admin.token
```

---

## 📡 API Endpoints

**Ver documentación completa en:** `API-DOCS.md`

### Principales Endpoints

**Autenticación:**
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Login usuario
- `POST /api/auth/admin/login` - Login admin

**Denuncias:**
- `POST /api/denuncias` - Crear denuncia
- `GET /api/denuncias/mis-denuncias` - Mis denuncias
- `GET /api/denuncias/consultar/:codigo` - Consultar por código
- `GET /api/denuncias` - Todas (admin)
- `PUT /api/denuncias/:id/estado` - Actualizar estado (admin)

**Catálogo:**
- `GET /api/catalogo/instituciones` - Listar instituciones
- `GET /api/catalogo/facultades` - Listar facultades
- `GET /api/catalogo/recursos` - Recursos de ayuda

---

## 📊 Base de Datos

### Tablas (12)
- `usuarios`, `administradores`, `denuncias`, `instituciones`, `facultades`
- `recursos`, `archivos`, `seguimiento_denuncia`, `atenciones`
- `log_accion`, `orientacion`, `denuncia_recurso`

### Procedimientos Almacenados (7)
- `sp_crear_denuncia` - Crear con código único
- `sp_actualizar_estado_denuncia` - Cambiar estado + seguimiento
- `sp_registrar_atencion` - Registrar atención
- `sp_obtener_denuncias_usuario` - Denuncias de usuario
- `sp_estadisticas_generales` - Dashboard
- Y más...

### Vistas (6)
- `vista_denuncias_completas`
- `vista_estadisticas_estado`
- `vista_denuncias_recientes`
- Y más...

---

## 📁 Estructura del Proyecto

```
VozSegura/
├── client/                  # ⚛️ Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API services
│   │   └── App.jsx          # App principal
│   ├── public/assets/       # Imágenes
│   └── package.json         # Dependencias frontend
├── config/
│   └── database.js          # Conexión MySQL
├── models/                  # Modelos de datos
├── controllers/             # Lógica de negocio
├── routes/                  # Rutas API
├── middleware/              # Autenticación JWT
├── database/                # Scripts SQL
├── assets/                  # Imágenes del servidor
├── .env                     # Configuración
├── server.js                # Servidor Express
├── README.md                # Este archivo
├── API-DOCS.md              # Documentación API
└── ESTRUCTURA-PROYECTO.md   # Documentación completa
```



---

## 🔧 Solución de Problemas

**Error de conexión MySQL:**
```powershell
# Verificar servicio
Get-Service MySQL*

# Reiniciar si es necesario
Restart-Service MySQL
```

**Tablas no existen:**
```powershell
node database/setup-database.js
```

**Módulos no encontrados:**
```powershell
npm install
```

---

## 🎯 Datos Iniciales

- ✅ 5 Instituciones educativas
- ✅ 9 Facultades
- ✅ 6 Recursos de ayuda (líneas, sitios web)
- ✅ 1 Administrador

---

## 🔐 Seguridad

- ✅ Passwords hasheados (bcrypt)
- ✅ JWT con expiración
- ✅ Prepared statements (SQL injection protection)
- ✅ Middleware de autorización
- ✅ Logs de auditoría

---

## � Documentación

- **README.md** - Este archivo (inicio rápido)
- **API-DOCS.md** - Documentación completa de la API

---
