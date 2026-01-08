# 🚀 Guía de Despliegue - VozSegura

## 📋 Índice
1. [Opciones de Despliegue](#opciones-de-despliegue)
2. [Preparación del Proyecto](#preparación-del-proyecto)
3. [Despliegue en Railway (Recomendado)](#opción-1-railway-recomendado)
4. [Despliegue en Render](#opción-2-render)
5. [Despliegue en Vercel + PlanetScale](#opción-3-vercel--planetscale)
6. [Variables de Entorno](#variables-de-entorno)
7. [Configuración de Base de Datos](#configuración-de-base-de-datos)
8. [Post-Despliegue](#post-despliegue)

---

## 🎯 Opciones de Despliegue

### **Opción 1: Railway (⭐ RECOMENDADO - Todo en uno)**
- ✅ **Gratis:** $5 crédito mensual
- ✅ **Base de datos MySQL incluida**
- ✅ **Deploy automático desde GitHub**
- ✅ **SSL/HTTPS automático**
- ✅ **Fácil configuración**
- 🎯 **Ideal para portafolio**

### **Opción 2: Render**
- ✅ **Gratis:** 750 horas/mes
- ✅ **Base de datos PostgreSQL gratis**
- ⚠️ **Necesitas adaptar de MySQL a PostgreSQL**
- ✅ **Deploy automático desde GitHub**

### **Opción 3: Vercel + PlanetScale**
- ✅ **Frontend gratis en Vercel**
- ✅ **Base de datos gratis en PlanetScale**
- ⚠️ **Requiere configuración separada**
- ✅ **Excelente rendimiento**

### **Opción 4: Heroku**
- ⚠️ **Ya no es gratis**
- 💰 **$5-7/mes mínimo**

---

## 📦 Preparación del Proyecto

### **Paso 1: Optimizar el proyecto para producción**

#### 1.1 Crear archivo `.gitignore` (si no existe)

```bash
# Dependencias
node_modules/
client/node_modules/

# Variables de entorno
.env
.env.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build
client/dist/
client/build/

# Uploads (opcional - depende de tu estrategia)
uploads/*
!uploads/.gitkeep

# Sistema
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/
*.swp
*.swo
```

#### 1.2 Crear archivo de variables de entorno de ejemplo

Ya tienes `.env.example`, asegúrate que contenga:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=vozsegura
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura
JWT_EXPIRES_IN=7d

# Servidor
PORT=3000
NODE_ENV=production

# URL del Frontend (para CORS)
FRONTEND_URL=https://tu-app.railway.app
```

#### 1.3 Actualizar `package.json` con scripts de producción

Verifica que tengas estos scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "build": "cd client && npm install && npm run build",
  "setup-db": "node database/setup-database.js",
  "postinstall": "cd client && npm install"
}
```

---

## 🚂 Opción 1: Railway (RECOMENDADO)

### **¿Por qué Railway?**
- Despliegue en menos de 10 minutos
- Base de datos MySQL incluida
- $5 de crédito gratis mensual (suficiente para proyectos pequeños)
- Deploy automático desde GitHub

### **Pasos de Despliegue:**

#### **1. Preparar el repositorio en GitHub**

```powershell
# Si no tienes Git inicializado
git init
git add .
git commit -m "Initial commit - VozSegura ready for deployment"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tuusuario/vozsegura.git
git branch -M main
git push -u origin main
```

#### **2. Crear cuenta en Railway**

1. Ve a https://railway.app/
2. Haz clic en **"Start a New Project"**
3. Conecta tu cuenta de GitHub
4. Selecciona **"Deploy from GitHub repo"**
5. Selecciona tu repositorio **VozSegura**

#### **3. Agregar Base de Datos MySQL**

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"Database"**
3. Elige **"MySQL"**
4. Railway creará automáticamente una base de datos

#### **4. Configurar Variables de Entorno**

En tu servicio de Railway (el que tiene tu código):

1. Ve a la pestaña **"Variables"**
2. Agrega las siguientes variables:

```
DB_HOST=${MYSQLHOST}
DB_USER=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DB_NAME=${MYSQLDATABASE}
DB_PORT=${MYSQLPORT}
JWT_SECRET=tu_clave_secreta_super_larga_y_segura_cambiar_esto
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

**💡 Tip:** Railway automáticamente conecta las variables de MySQL si usas las referencias `${MYSQL...}`

#### **5. Configurar el Build**

Railway detectará automáticamente tu proyecto Node.js. Si no:

1. Ve a **Settings** → **Build Command**
2. Agrega: `npm install && npm run build`
3. Start Command: `npm start`

#### **6. Ejecutar Setup de Base de Datos**

Opción A - Desde Railway CLI:
```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ejecutar setup
railway run node database/setup-database.js
```

Opción B - Importar SQL directamente:
1. Conecta a tu base de datos MySQL de Railway usando un cliente (MySQL Workbench, DBeaver)
2. Importa el archivo `config/script.sql`

#### **7. Desplegar**

Railway desplegará automáticamente. Verás el progreso en tiempo real.

#### **8. Obtener tu URL**

1. Ve a **Settings** → **Networking**
2. Haz clic en **"Generate Domain"**
3. Railway te dará una URL como: `https://vozsegura-production.up.railway.app`

#### **9. Actualizar CORS en el código**

Actualiza el archivo `server.js` para aceptar tu nueva URL:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174',
        'https://vozsegura-production.up.railway.app', // Tu URL de Railway
        process.env.FRONTEND_URL
    ],
    credentials: true
}));
```

---

## 🎨 Opción 2: Render

### **Pasos de Despliegue:**

#### **1. Crear cuenta en Render**

1. Ve a https://render.com/
2. Conecta tu cuenta de GitHub

#### **2. Crear Base de Datos PostgreSQL**

⚠️ **Nota:** Render ofrece PostgreSQL gratis, no MySQL. Necesitarás adaptar tu código.

1. En Render, haz clic en **"New +"** → **"PostgreSQL"**
2. Configura y crea la base de datos
3. Guarda las credenciales

#### **3. Crear Web Service**

1. Haz clic en **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Configura:
   - **Name:** vozsegura
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

#### **4. Agregar Variables de Entorno**

En la sección **Environment**, agrega:

```
DATABASE_URL=postgres://... (la URL que te dio Render)
JWT_SECRET=tu_clave_secreta
NODE_ENV=production
PORT=10000
```

#### **5. Adaptar código para PostgreSQL**

Necesitarás cambiar todas las consultas MySQL a PostgreSQL:
- Cambiar `?` por `$1, $2, $3...`
- Usar la librería `pg` en lugar de `mysql2`
- Adaptar tipos de datos

---

## ☁️ Opción 3: Vercel + PlanetScale

### **Frontend en Vercel:**

#### **1. Preparar el Frontend**

Actualiza `client/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tu-backend.railway.app', // URL de tu backend
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

#### **2. Desplegar en Vercel**

```powershell
# Instalar Vercel CLI
npm i -g vercel

# Navegar al frontend
cd client

# Desplegar
vercel

# Para producción
vercel --prod
```

#### **3. Backend en Railway**

Sigue los pasos de Railway para el backend.

---

## 🔐 Variables de Entorno

### **Generar JWT_SECRET seguro:**

```powershell
# Opción 1: PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Variables requeridas:**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de la base de datos | `containers-us-west-123.railway.app` |
| `DB_USER` | Usuario de la base de datos | `root` |
| `DB_PASSWORD` | Contraseña de la base de datos | `********` |
| `DB_NAME` | Nombre de la base de datos | `railway` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `JWT_SECRET` | Clave secreta para JWT | (generar con comando) |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `7d` |
| `NODE_ENV` | Entorno | `production` |
| `PORT` | Puerto del servidor | `3000` |
| `FRONTEND_URL` | URL del frontend (CORS) | `https://tu-app.vercel.app` |

---

## 🗄️ Configuración de Base de Datos

### **Setup Inicial de la Base de Datos:**

#### **Opción A: Usando Railway CLI**

```powershell
# Conectar a Railway
railway login

# Ejecutar setup
railway run node database/setup-database.js
```

#### **Opción B: Conectar directamente con MySQL Workbench**

1. Obtén las credenciales de Railway:
   - Host, Port, User, Password, Database
2. Conecta con MySQL Workbench
3. Ejecuta el archivo `config/script.sql`

#### **Opción C: Desde código (automático)**

Agrega este endpoint temporal en `server.js`:

```javascript
// Endpoint para inicializar la base de datos (SOLO USAR UNA VEZ)
app.get('/api/setup-database', async (req, res) => {
    try {
        // Ejecutar setup
        const setupScript = require('./database/setup-database');
        await setupScript();
        
        res.json({
            success: true,
            message: 'Base de datos configurada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
```

Luego accede a: `https://tu-app.railway.app/api/setup-database`

**⚠️ IMPORTANTE:** Elimina este endpoint después de usarlo por seguridad.

---

## ✅ Post-Despliegue

### **1. Verificar que todo funciona:**

#### Checklist:
- [ ] La aplicación carga correctamente
- [ ] Puedes crear una cuenta
- [ ] Puedes iniciar sesión
- [ ] Puedes crear una denuncia
- [ ] El admin puede acceder al dashboard
- [ ] Las gráficas se muestran correctamente
- [ ] Los archivos se pueden subir

### **2. Crear cuenta de administrador:**

Opción A - Desde Railway CLI:
```powershell
railway run node database/crear-admin.js
```

Opción B - Manualmente en la base de datos:
```sql
-- El sistema ya crea un admin por defecto
-- Email: admin@vozsegura.com
-- Password: Admin123!
```

### **3. Configurar dominio personalizado (Opcional):**

#### En Railway:
1. Ve a **Settings** → **Networking**
2. Haz clic en **"Custom Domain"**
3. Agrega tu dominio (ej: `vozsegura.tudominio.com`)
4. Configura los registros DNS según las instrucciones

### **4. Monitoreo:**

#### Railway Dashboard:
- Ve a **Metrics** para ver:
  - CPU usage
  - RAM usage
  - Network traffic
  - Logs en tiempo real

---

## 📸 Capturas de Pantalla para Portafolio

### **Qué Documentar:**

1. **Página de inicio** (Hero section)
2. **Formulario de denuncia** (con datos de ejemplo)
3. **Dashboard administrativo** (con gráficas)
4. **Consulta de denuncia** (timeline)
5. **Mis denuncias** (vista de usuario)
6. **Responsive design** (móvil y desktop)

### **Herramientas recomendadas:**
- **Screely.com** - Agregar mockups profesionales
- **Carbon.now.sh** - Capturas de código con estilo
- **Figma** - Crear presentaciones visuales

---

## 🎯 Para tu Portafolio

### **README.md Profesional:**

Asegúrate de tener un README atractivo con:

```markdown
# VozSegura 🛡️

> Sistema de denuncias anónimas para instituciones educativas

## 🚀 Demo en Vivo
[Ver Demo](https://vozsegura.railway.app)

## 🎥 Video Demo
[Ver en YouTube](tu-link)

## 📸 Capturas de Pantalla
[Agregar imágenes]

## 🛠️ Tecnologías
- React 19
- Node.js + Express
- MySQL
- Chart.js
- JWT Authentication

## ✨ Características
- ✅ Denuncias anónimas con código único
- ✅ Dashboard administrativo con estadísticas
- ✅ Gráficas interactivas
- ✅ Sistema de seguimiento
- ✅ Responsive design

## 🔧 Instalación Local
[Instrucciones]

## 👨‍💻 Autor
Juan Luis - [GitHub](https://github.com/juanluligo)
```

---

## 🐛 Solución de Problemas Comunes

### **Error: "Cannot connect to database"**
- Verifica que las variables de entorno estén correctas
- Revisa que la base de datos esté corriendo
- Verifica que el host y puerto sean correctos

### **Error: "CORS policy blocked"**
- Agrega la URL de producción al array de CORS en `server.js`
- Asegúrate de incluir `https://` en la URL

### **Error: "Failed to build"**
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Railway/Render
- Asegúrate de que el comando de build sea correcto

### **La aplicación es lenta**
- Railway puede "dormir" después de 5 min de inactividad (plan gratis)
- Considera usar un servicio de "keep-alive" como UptimeRobot

---

## 📊 Métricas para Portafolio

Agrega un badge de estado en tu README:

```markdown
![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
```

---

## 🎓 Siguientes Pasos

1. **Dominio personalizado**: Compra un dominio en Namecheap (~$3/año)
2. **Analytics**: Agrega Google Analytics
3. **Monitoring**: Configura UptimeRobot para monitoreo
4. **CI/CD**: Configura GitHub Actions para tests automáticos
5. **Documentation**: Mantén actualizado el README

---

## 📞 Soporte

Si tienes problemas durante el despliegue:
- Revisa los logs en Railway/Render
- Consulta la documentación oficial
- GitHub Issues del proyecto

---

**¡Tu proyecto está listo para impresionar en tu portafolio! 🚀**

