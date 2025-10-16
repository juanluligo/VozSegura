const express = require('express');
const router = express.Router();
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
    eliminarDenuncia
} = require('../controllers/denunciaController');
const { protect, isAdmin } = require('../middleware/auth');

// Rutas públicas
router.get('/consultar/:codigo', consultarDenuncia);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, crearDenuncia);
router.get('/mis-denuncias', protect, misDenuncias);
router.get('/:id', protect, obtenerDenuncia);
router.put('/:id', protect, actualizarDenuncia);

// Rutas solo para administradores
router.get('/', protect, isAdmin, obtenerDenuncias);
router.put('/:id/estado', protect, isAdmin, actualizarEstado);
router.post('/:id/atencion', protect, isAdmin, registrarAtencion);
router.post('/:id/recursos', protect, isAdmin, asignarRecursos);
router.get('/estadisticas/general', protect, isAdmin, obtenerEstadisticas);
router.delete('/:id', protect, isAdmin, eliminarDenuncia);

module.exports = router;
