# 🚀 Guía de Despliegue en Vercel - VozSegura

## 📌 Arquitectura Recomendada

```
┌─────────────────┐
│  Vercel         │  ← Frontend + Backend API
│  vozsegura.com  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Railway        │  ← Base de Datos MySQL
│  MySQL Database │
└─────────────────┘
```

---

## 🎯 Opción 1: Todo en Vercel (Monorepo)

### Paso 1: Preparar Git

```powershell
# Asegúrate de estar en la carpeta raíz
cd "c:\Users\juanl\OneDrive\Escritorio\proyectos personales\VosSegura1.2\VosSegura1.2\VozSegura"

# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Commit
git commit -m "Deploy: VozSegura v1.0 to Vercel"

# Crear repositorio en GitHub
# Ve a: https://github.com/new
# Nombre: vozsegura

# Conectar con GitHub
git remote add origin https://github.com/TU_USUARIO/vozsegura.git
git branch -M main
git push -u origin main
```

### Paso 2: Configurar Base de Datos en Railway

1. **Ir a Railway**: https://railway.app/
2. **Nuevo Proyecto**: Click en "New Project"
3. **Agregar MySQL**:
   - Selecciona "Provision MySQL"
   - Espera a que se despliegue (2-3 minutos)
4. **Obtener Credenciales**:
   - Click en el servicio MySQL
   - Ve a "Variables" tab
   - Copia las variables: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
5. **Configurar Base de Datos**:
   ```powershell
   # Instalar Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Vincular proyecto
   railway link
   
   # Ejecutar setup de BD
   railway run node database/setup-database.js
   railway run node database/crear-admin.js
   ```

### Paso 3: Desplegar en Vercel

1. **Ir a Vercel**: https://vercel.com/
2. **Importar Proyecto**:
   - Click en "Add New..." → "Project"
   - Selecciona tu repositorio de GitHub "vozsegura"
3. **Configurar Build**:
   ```
   Framework Preset: Other
   Build Command: npm run build
   Output Directory: client/dist
   Install Command: npm install
   ```
4. **Variables de Entorno** (Settings → Environment Variables):
   
   Agrega estas variables:
   
   ```env
   # Base de Datos (desde Railway)
   DB_HOST=containers-us-west-xxx.railway.app
   DB_USER=root
   DB_PASSWORD=tu_password_railway
   DB_NAME=railway
   DB_PORT=1234
   
   # JWT (genera uno nuevo)
   JWT_SECRET=tu_clave_super_segura_64_caracteres
   JWT_EXPIRE=30d
   
   # Entorno
   NODE_ENV=production
   PORT=3000
   
   # URLs (después del deploy)
   FRONTEND_URL=https://tu-app.vercel.app
   PRODUCTION_URL=https://tu-app.vercel.app
   ```

5. **Generar JWT_SECRET seguro**:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. **Deploy**: Click en "Deploy"

### Paso 4: Verificar Despliegue

1. **Verificar Backend**:
   - Ve a: `https://tu-app.vercel.app/api/test/conexion`
   - Deberías ver: `{"mensaje": "Conexión exitosa", ...}`

2. **Verificar Frontend**:
   - Ve a: `https://tu-app.vercel.app`
   - Deberías ver la página de inicio

3. **Login Admin**:
   - Email: `admin@vozsegura.com`
   - Password: `Admin123!`

---

## 🎯 Opción 2: Frontend en Vercel + Backend en Railway (RECOMENDADO)

Esta opción separa frontend y backend para mejor rendimiento.

### Paso 1: Desplegar Backend en Railway

```powershell
# En la carpeta del proyecto
cd "c:\Users\juanl\OneDrive\Escritorio\proyectos personales\VosSegura1.2\VosSegura1.2\VozSegura"

# Login en Railway
railway login

# Crear nuevo proyecto
railway init

# Vincular con Railway
railway up

# Agregar MySQL
# Ve a Railway Dashboard → Add MySQL

# Configurar variables
# Railway detectará automáticamente el package.json

# Deploy
git add .
git commit -m "Deploy to Railway"
git push
```

### Paso 2: Desplegar Frontend en Vercel

1. **Modificar `client/vite.config.js`**:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: {
         '/api': {
           target: process.env.VITE_API_URL || 'http://localhost:3000',
           changeOrigin: true,
         }
       }
     },
     build: {
       outDir: 'dist',
       emptyOutDir: true,
     }
   })
   ```

2. **Crear `client/.env.production`**:
   ```env
   VITE_API_URL=https://vozsegura-production.up.railway.app
   ```

3. **En Vercel**:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Variable de Entorno: `VITE_API_URL=https://tu-backend.railway.app`

---

## 🔧 Scripts Útiles

```powershell
# Construir frontend localmente
cd client
npm run build

# Probar build localmente
npm run preview

# Verificar que todo compile
npm run build
```

---

## ⚠️ Checklist Pre-Deploy

- [ ] `.env` no está en Git (está en `.gitignore`)
- [ ] Base de datos configurada en Railway
- [ ] `npm run build` funciona sin errores
- [ ] Variables de entorno configuradas en Vercel
- [ ] JWT_SECRET es único y seguro (64+ caracteres)
- [ ] CORS configurado con URLs de producción

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD` en Vercel
- Asegúrate que Railway MySQL esté activo

### Error: "CORS policy"
- Agrega la URL de Vercel en `server.js`:
  ```javascript
  const allowedOrigins = [
      'https://tu-app.vercel.app',
      'http://localhost:5173',
  ];
  ```

### Frontend no carga
- Verifica que `client/dist` se haya generado correctamente
- Revisa los logs en Vercel Dashboard

### API no responde
- Verifica que las rutas en `vercel.json` sean correctas
- Revisa los logs de Vercel Functions

---

## 📱 URLs Después del Deploy

- **Frontend**: `https://vozsegura.vercel.app`
- **Backend API**: `https://vozsegura.vercel.app/api`
- **Test Conexión**: `https://vozsegura.vercel.app/api/test/conexion`

---

## 🎉 ¡Listo!

Tu aplicación VozSegura estará disponible en:
- 🌐 **Frontend**: Vercel (ultra rápido)
- ⚙️ **Backend**: Vercel Serverless Functions
- 🗄️ **Database**: Railway MySQL (siempre activo)

**Credenciales Admin:**
- Email: `admin@vozsegura.com`
- Password: `Admin123!`
