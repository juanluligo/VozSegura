const express = require('express');
const path = require('path');

// Inicializar Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// TODO: Rutas de API (pendientes de implementación)
// app.use('/api/auth', authRoutes);
// app.use('/api/denuncias', denunciaRoutes);

// Ruta principal - servir home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Ruta de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// TODO: Conexión a MongoDB (pendiente de implementación)
// const connectDB = async () => { ... }

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: 'Error del servidor'
    });
});

// Ruta 404
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Página no encontrada</h1>
        <p>La ruta solicitada no existe.</p>
        <a href="/">Volver al inicio</a>
    `);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📂 Estructura MVC lista para desarrollo`);
});

module.exports = app;
