# ⚡ DEPLOY RÁPIDO A VERCEL - VozSegura

## 🚀 PASOS RÁPIDOS (5 minutos)

### 1️⃣ Preparar Git y Subir a GitHub

```powershell
# Asegúrate de estar en la carpeta correcta
cd "c:\Users\juanl\OneDrive\Escritorio\proyectos personales\VosSegura1.2\VosSegura1.2\VozSegura"

# Inicializar Git (si no está)
git init

# Agregar archivos
git add .

# Commit
git commit -m "Deploy: VozSegura v1.0 - Ready for Vercel"

# Crear repo en GitHub: https://github.com/new
# Nombre sugerido: vozsegura

# Conectar y subir
git remote add origin https://github.com/TU_USUARIO/vozsegura.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Configurar Base de Datos en Railway (3 min)

1. **Ir a**: https://railway.app/
2. **Login** con GitHub
3. **New Project** → **Provision MySQL**
4. **Copiar credenciales** (las necesitarás en el paso 3):
   - Click en MySQL service
   - Variables tab
   - Copia: `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`

5. **Configurar BD** (instalar Railway CLI):
   ```powershell
   npm install -g @railway/cli
   railway login
   railway link
   railway run node database/setup-database.js
   railway run node database/crear-admin.js
   ```

---

### 3️⃣ Desplegar en Vercel (2 min)

1. **Ir a**: https://vercel.com/
2. **Login** con GitHub
3. **Add New... → Project**
4. **Import tu repo** "vozsegura"
5. **Configurar**:
   ```
   Framework Preset: Other
   Build Command: npm run vercel-build
   Output Directory: client/dist
   Install Command: npm install
   Root Directory: ./
   ```

6. **Environment Variables** (copiar y pegar todo esto):

```env
# Base de Datos Railway (pegar tus valores)
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=TU_PASSWORD_DE_RAILWAY
DB_NAME=railway
DB_PORT=PUERTO_DE_RAILWAY

# JWT Secret (genera uno nuevo)
JWT_SECRET=PEGAR_AQUI_EL_JWT_GENERADO

# Configuración
JWT_EXPIRE=30d
NODE_ENV=production
PORT=3000
```

7. **Generar JWT_SECRET**:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

8. **Deploy** → Click en "Deploy"

---

### 4️⃣ Verificar (30 segundos)

1. **Ver tu app**: `https://tu-app.vercel.app`
2. **Test API**: `https://tu-app.vercel.app/api/test/conexion`
3. **Login Admin**:
   - Email: `admin@vozsegura.com`
   - Password: `Admin123!`

---

## ✅ CHECKLIST

- [ ] Git inicializado
- [ ] Código subido a GitHub
- [ ] MySQL configurado en Railway
- [ ] Base de datos inicializada (setup-database.js)
- [ ] Admin creado (crear-admin.js)
- [ ] Proyecto importado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] App funcionando en tu URL de Vercel
- [ ] Login admin funciona

---

## 🐛 PROBLEMAS COMUNES

### Error: "Cannot connect to database"
**Solución**: Verifica que las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD` sean exactamente las de Railway

### Error: "CORS policy"
**Solución**: Actualiza `FRONTEND_URL` y `PRODUCTION_URL` con tu URL de Vercel

### Frontend carga pero API no funciona
**Solución**: Verifica que `vercel.json` tenga las rutas correctas

---

## 📞 URLs FINALES

Después del deploy tendrás:

- **App Principal**: `https://vozsegura-xxx.vercel.app`
- **API Test**: `https://vozsegura-xxx.vercel.app/api/test/conexion`
- **Login**: `https://vozsegura-xxx.vercel.app/login`

---

## 🎉 ¡LISTO!

Tu app está en producción y lista para usar.

**Credenciales Admin:**
- 📧 Email: `admin@vozsegura.com`
- 🔑 Password: `Admin123!`

**Recuerda cambiar la contraseña después del primer login!**
