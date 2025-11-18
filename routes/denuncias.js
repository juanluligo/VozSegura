const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
    crearDenuncia,
    consultarDenuncia,
    obtenerDenuncias,
    obtenerDenuncia,
    misDenuncias,
    actualizarEstado,
    actualizarDenuncia,
    registrarAtencion,
    asignarRecursos,
    obtenerEstadisticas,
    eliminarDenuncia,
    obtenerArchivos
} = require('../controllers/denunciaController');
const { protect, isAdmin } = require('../middleware/auth');

// Configuración de Multer para subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/denuncias/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'evidencia-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para validar tipos de archivo
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (JPG, PNG, GIF), videos (MP4, MOV, AVI, MKV) o PDF'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB máximo
    },
    fileFilter: fileFilter
});

// Rutas públicas
// Consultar denuncia por código (público)
router.get('/consultar/:codigo', consultarDenuncia);

// Rutas protegidas específicas (deben ir ANTES de /:id)
router.get('/todas', protect, isAdmin, obtenerDenuncias);
router.get('/mis-denuncias', protect, misDenuncias);
router.get('/estadisticas/general', protect, isAdmin, obtenerEstadisticas);

// Rutas con archivos
router.post('/', protect, upload.array('archivos', 5), crearDenuncia);
router.get('/:id/archivos', protect, obtenerArchivos);

// Rutas con parámetro :id (deben ir AL FINAL)
router.get('/:id', protect, obtenerDenuncia);
router.put('/:id', protect, actualizarDenuncia);
router.put('/:id/estado', protect, isAdmin, actualizarEstado);
router.post('/:id/atencion', protect, isAdmin, registrarAtencion);
router.post('/:id/recursos', protect, isAdmin, asignarRecursos);
router.delete('/:id', protect, isAdmin, eliminarDenuncia);

module.exports = router;
