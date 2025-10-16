const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Servir la aplicación React en producción
const clientBuildPath = path.join(__dirname, 'client', 'dist');
if (require('fs').existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
}

// Rutas de API
const authRoutes = require('./routes/auth');
const denunciaRoutes = require('./routes/denuncias');
const catalogoRoutes = require('./routes/catalogo');

app.use('/api/auth', authRoutes);
app.use('/api/denuncias', denunciaRoutes);
app.use('/api/catalogo', catalogoRoutes);

// Ruta de prueba para verificar conexión
app.get('/api/test/conexion', async (req, res) => {
    try {
        const { query } = require('./config/database');
        const resultado = await query('SELECT 1 + 1 AS resultado');
        
        res.json({
            success: true,
            mensaje: 'Conexión a MySQL exitosa',
            test: resultado[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error de conexión',
            error: error.message
        });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Error del servidor'
    });
});

// Ruta catch-all - servir React app para cualquier ruta no API
app.get('*', (req, res) => {
    if (require('fs').existsSync(clientBuildPath)) {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
        res.status(200).send(`
            <h1>🚀 Servidor Express corriendo</h1>
            <p>La aplicación React no está construida aún.</p>
            <p>Para desarrollo: <code>cd client && npm run dev</code></p>
            <p>Para producción: <code>cd client && npm run build</code></p>
            <p><a href="/api/test/conexion">Probar conexión a la base de datos</a></p>
        `);
    }
});

// Conectar a la base de datos e iniciar servidor
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📂 Estructura MVC lista para desarrollo`);
            console.log(`💾 Base de datos: ${process.env.DB_NAME || 'vozsegura'}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();

module.exports = app;

