const express = require('express');
const router = express.Router();
const {
    crearDenuncia,
    consultarDenuncia,
    obtenerDenuncias,
    actualizarEstado,
    obtenerEstadisticas
} = require('../controllers/denunciaController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

// Rutas públicas o con autenticación opcional
router.post('/', optionalAuth, crearDenuncia);
router.get('/consultar/:codigo', consultarDenuncia);

// Rutas protegidas (requieren autenticación)
router.get('/', protect, authorize('admin', 'docente'), obtenerDenuncias);
router.put('/:id/estado', protect, authorize('admin', 'docente'), actualizarEstado);
router.get('/estadisticas/general', protect, authorize('admin'), obtenerEstadisticas);

module.exports = router;
