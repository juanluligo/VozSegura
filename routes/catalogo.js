const express = require('express');
const router = express.Router();
const Institucion = require('../models/Institucion');
const Facultad = require('../models/Facultad');
const Recurso = require('../models/Recurso');
const { protect, isAdmin } = require('../middleware/auth');


// Obtener todas las instituciones
router.get('/instituciones', async (req, res) => {
    try {
        const instituciones = await Institucion.obtenerTodas();
        res.json({ success: true, instituciones });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener institución por ID
router.get('/instituciones/:id', async (req, res) => {
    try {
        const institucion = await Institucion.buscarPorId(req.params.id);
        if (!institucion) {
            return res.status(404).json({ success: false, message: 'Institución no encontrada' });
        }
        res.json({ success: true, institucion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener facultades de una institución
router.get('/instituciones/:id/facultades', async (req, res) => {
    try {
        const facultades = await Institucion.obtenerFacultades(req.params.id);
        res.json({ success: true, facultades });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Crear institución (solo admin)
router.post('/instituciones', protect, isAdmin, async (req, res) => {
    try {
        const institucion = await Institucion.crear(req.body);
        res.status(201).json({ success: true, institucion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Actualizar institución (solo admin)
router.put('/instituciones/:id', protect, isAdmin, async (req, res) => {
    try {
        const institucion = await Institucion.actualizar(req.params.id, req.body);
        res.json({ success: true, institucion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== FACULTADES ==========

// Obtener todas las facultades
router.get('/facultades', async (req, res) => {
    try {
        const facultades = await Facultad.obtenerTodas();
        res.json({ success: true, facultades });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener facultad por ID
router.get('/facultades/:id', async (req, res) => {
    try {
        const facultad = await Facultad.buscarPorId(req.params.id);
        if (!facultad) {
            return res.status(404).json({ success: false, message: 'Facultad no encontrada' });
        }
        res.json({ success: true, facultad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener estadísticas de una facultad (solo admin)
router.get('/facultades/:id/estadisticas', protect, isAdmin, async (req, res) => {
    try {
        const estadisticas = await Facultad.obtenerEstadisticas(req.params.id);
        res.json({ success: true, estadisticas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Crear facultad (solo admin)
router.post('/facultades', protect, isAdmin, async (req, res) => {
    try {
        const facultad = await Facultad.crear(req.body);
        res.status(201).json({ success: true, facultad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Actualizar facultad (solo admin)
router.put('/facultades/:id', protect, isAdmin, async (req, res) => {
    try {
        const facultad = await Facultad.actualizar(req.params.id, req.body);
        res.json({ success: true, facultad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ========== RECURSOS ==========

// Obtener todos los recursos
router.get('/recursos', async (req, res) => {
    try {
        const recursos = await Recurso.obtenerTodos();
        res.json({ success: true, recursos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Obtener recurso por ID
router.get('/recursos/:id', async (req, res) => {
    try {
        const recurso = await Recurso.buscarPorId(req.params.id);
        if (!recurso) {
            return res.status(404).json({ success: false, message: 'Recurso no encontrado' });
        }
        res.json({ success: true, recurso });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Crear recurso (solo admin)
router.post('/recursos', protect, isAdmin, async (req, res) => {
    try {
        const recurso = await Recurso.crear(req.body);
        res.status(201).json({ success: true, recurso });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Actualizar recurso (solo admin)
router.put('/recursos/:id', protect, isAdmin, async (req, res) => {
    try {
        const recurso = await Recurso.actualizar(req.params.id, req.body);
        res.json({ success: true, recurso });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
