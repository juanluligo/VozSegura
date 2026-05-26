# 🚀 Guía de Despliegue - Backend VozSegura

Este proyecto ahora está configurado para desplegar **SOLO el backend**.

---

## 📋 Preparación Previa

1. **Copia el archivo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Edita el archivo `.env` con tus valores reales:**
   - `MONGODB_URI`: URL de tu base de datos MongoDB Atlas
   - `JWT_SECRET`: Genera una cadena segura (puede ser: `openssl rand -base64 32`)
   - `FRONTEND_URL`: URL donde está tu frontend
   - `PORT`: Puerto donde corre el backend (default: 3000)

---

## 🚀 Opción 1: Desplegar en Railway

### Paso 1: Preparar repositorio
```bash
git add .
git commit -m "Configurar backend solo"
git push
```

### Paso 2: En railway.app
1. Ve a [railway.app](https://railway.app)
2. Haz login con GitHub
3. Click en "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio `VozSegura-mongo`
5. Espera a que Railway detecte automáticamente la configuración

### Paso 3: Configurar variables de entorno
En el panel de Railway:
1. Ve a la sección "Variables"
2. Agrega tus variables del `.env`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

3. Railway automáticamente:
   - Instala dependencias: `npm install`
   - Inicia el servidor: `npm start`

**Tu backend estará en vivo en:** `https://[nombre-del-proyecto].up.railway.app`

---

## 🔵 Opción 2: Desplegar en Vercel

### Paso 1: Preparar repositorio
Mismo que arriba.

### Paso 2: En vercel.com
1. Ve a [vercel.com](https://vercel.com)
2. Haz login con GitHub
3. Click en "Add New" → "Project"
4. Selecciona tu repositorio
5. En "Root Directory" deja en blanco (raíz)
6. Click "Deploy"

### Paso 3: Configurar variables
1. En el proyecto de Vercel, ve a "Settings" → "Environment Variables"
2. Agrega:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`

**Tu backend estará en vivo en:** `https://[nombre-proyecto].vercel.app`

---

## ⚙️ Scripts disponibles

```bash
# Desarrollo local
npm run dev

# Producción
npm start

# Instalar dependencias
npm install
```

---

## 🔗 Configurar CORS en tu Frontend

Después de desplegar, actualiza la URL de tu API en `client/src/services/api.js`:

```javascript
// Para desarrollo
const API_URL = 'http://localhost:3000/api';

// Para producción
const API_URL = 'https://[tu-backend-url].app/api';
```

---

## ✅ Verificar que funciona

```bash
# Desde terminal, prueba la conexión
curl https://[tu-backend-url].app/api/test/conexion
```

---

## 📝 Notas importantes

- ✅ El cliente ahora se despliega **aparte**
- ✅ El backend sirve solo APIs en `/api/*`
- ✅ Las variables de entorno son **críticas** para producción
- ✅ Asegúrate de cambiar `JWT_SECRET` a algo único y seguro
- ✅ Verifica que `MONGODB_URI` sea correcta

---

## 🆘 Solución de problemas

**Error: "Cannot find module"**
- Ejecuta: `npm install`

**Error: "Connection refused"**
- Verifica que `MONGODB_URI` sea correcta
- Asegúrate que tu IP está en MongoDB Atlas whitelist

**Error: "CORS origin not allowed"**
- Actualiza `FRONTEND_URL` en las variables de entorno
- Redespliega el backend

---

¡Listo! Tu backend está configurado para despliegue en production. 🎉
