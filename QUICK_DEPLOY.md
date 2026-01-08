# 🚀 Guía Rápida de Despliegue

## 📝 Checklist Previo

```powershell
# 1. Verificar que todo esté listo
npm run pre-deploy

# 2. Probar localmente
npm install
npm run setup-db
npm start
```

---

## 🎯 Opción Recomendada: Railway

### Paso 1: Preparar Git

```powershell
# Inicializar Git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Commit
git commit -m "Ready for deployment - VozSegura v1.0.0"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU_USUARIO/vozsegura.git
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar en Railway

1. **Ir a Railway**: https://railway.app/
2. **Conectar GitHub**: Autoriza Railway a acceder a tu GitHub
3. **Nuevo Proyecto**: "New Project" → "Deploy from GitHub repo"
4. **Seleccionar repo**: Elige "vozsegura"
5. **Agregar MySQL**: 
   - Click en "+ New"
   - Selecciona "Database" → "MySQL"
6. **Configurar Variables** (en el servicio de tu app):

```env
DB_HOST=${MYSQLHOST}
DB_USER=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DB_NAME=${MYSQLDATABASE}
DB_PORT=${MYSQLPORT}
JWT_SECRET=<generar-clave-segura-64-caracteres>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

7. **Generar JWT_SECRET seguro**:

```powershell
# PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# O en Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

8. **Deploy automático**: Railway detectará los cambios y desplegará

9. **Obtener URL**: Settings → Networking → "Generate Domain"

10. **Configurar Base de Datos**:

```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Ejecutar setup de DB
railway run node database/setup-database.js
```

### Paso 3: Post-Despliegue

```powershell
# Crear admin
railway run node database/crear-admin.js

# Verificar conexión
# Acceder a: https://tu-app.railway.app/api/test/conexion
```

---

## ⚡ Comandos Útiles

### Local

```powershell
# Desarrollo
npm run dev              # Backend con nodemon
npm run client           # Frontend Vite

# Producción local
npm run build            # Build del frontend
npm start                # Iniciar servidor

# Base de datos
npm run setup-db         # Configurar DB
npm run test-db          # Probar conexión

# Pre-despliegue
npm run pre-deploy       # Verificar checklist
```

### Railway CLI

```powershell
# Instalar
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs

# Ejecutar comandos
railway run <comando>

# Variables
railway variables

# Vincular proyecto local
railway link
```

---

## 🌐 URLs Importantes

Una vez desplegado:

- **App**: `https://vozsegura-production.up.railway.app`
- **API Test**: `https://tu-app.railway.app/api/test/conexion`
- **Dashboard Railway**: https://railway.app/dashboard

---

## ✅ Verificación Post-Despliegue

1. ✅ La app carga correctamente
2. ✅ Puedes crear una cuenta
3. ✅ Puedes iniciar sesión
4. ✅ Puedes crear una denuncia
5. ✅ El admin puede acceder (admin@vozsegura.com / Admin123!)
6. ✅ El dashboard muestra gráficas
7. ✅ Las imágenes cargan correctamente

---

## 🐛 Solución de Problemas

### "Cannot connect to database"

```powershell
# Ver variables de entorno en Railway
railway variables

# Verificar que las variables ${MYSQL...} estén correctas
```

### "CORS blocked"

En `server.js`, agregar tu URL de Railway:

```javascript
const allowedOrigins = [
    'https://tu-app.railway.app', // AGREGAR ESTA
    process.env.FRONTEND_URL
];
```

### "Build failed"

Revisar logs en Railway:
- Dashboard → Tu servicio → Deployments → View logs

### La app es lenta (sleep)

Railway en plan gratis "duerme" después de 5 min de inactividad.
Solución: Usar servicio gratuito como UptimeRobot para hacer ping cada 5 min.

---

## 📊 Monitoreo

### Railway Dashboard

- **Metrics**: CPU, RAM, Network
- **Logs**: En tiempo real
- **Deployments**: Historial de deploys

### UptimeRobot (Opcional)

1. Ir a: https://uptimerobot.com/
2. Crear cuenta gratis
3. "Add New Monitor"
4. URL: `https://tu-app.railway.app/api/test/conexion`
5. Interval: 5 minutos

Esto mantiene tu app "despierta" en el plan gratis.

---

## 🎯 Para Portafolio

### Dominio Personalizado (Opcional)

**Opción 1: Dominio propio**
1. Comprar en Namecheap/GoDaddy (~$3-10/año)
2. En Railway: Settings → Networking → Custom Domain
3. Configurar DNS según instrucciones

**Opción 2: Subdominio gratuito**
Railway te da uno gratis: `tu-app.up.railway.app`

### README en GitHub

Asegúrate de actualizar:
- Link a demo en vivo
- Capturas de pantalla
- Video demostración (opcional)

### Presentación

1. **Capturas de pantalla**: Home, Dashboard, Denuncias
2. **Video corto (1-2 min)**: Subir a YouTube
3. **LinkedIn**: Post anunciando el proyecto
4. **Portfolio personal**: Agregar caso de estudio

---

## 💰 Costos

### Railway (Recomendado)
- **Plan Gratis**: $5 USD de crédito mensual
- **Suficiente para**: 
  - 1 App Node.js
  - 1 Base de datos MySQL
  - ~500 horas/mes (más que suficiente para portafolio)
- **Upgrade**: $5/mes si necesitas más

### Alternativas Gratuitas
- **Render**: 750 horas/mes gratis (PostgreSQL)
- **Vercel**: Hosting frontend gratis ilimitado
- **PlanetScale**: MySQL gratis hasta 5GB

---

## 📞 Soporte

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **Esta guía**: `DEPLOYMENT.md` (guía completa)

---

**¡Tu app estará en vivo en menos de 15 minutos! 🚀**
