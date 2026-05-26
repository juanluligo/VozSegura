const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');

dotenv.config();

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.PRODUCTION_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const clientBuildPath = path.join(__dirname, 'client', 'dist');
if (require('fs').existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
}

// Rutas de API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/denuncias', require('./routes/denuncias'));
app.use('/api/catalogo', require('./routes/catalogo'));

// Ruta de prueba de conexión
app.get('/api/test/conexion', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const estados = { 0: 'desconectado', 1: 'conectado', 2: 'conectando', 3: 'desconectando' };
        res.json({
            success: true,
            mensaje: 'Conexión a MongoDB exitosa',
            estado: estados[mongoose.connection.readyState],
            base_datos: mongoose.connection.name
        });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error de conexión', error: error.message });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Catch-all para React
app.get('*', (req, res) => {
    if (require('fs').existsSync(clientBuildPath)) {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
        res.status(200).send(`
            <h1>VozSegura - Servidor corriendo</h1>
            <p>Para desarrollo: <code>cd client && npm run dev</code></p>
            <p><a href="/api/test/conexion">Probar conexión a MongoDB</a></p>
        `);
    }
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log(`Base de datos: MongoDB`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();

module.exports = app;
