const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    registro,
    login,
    loginAdmin,
    obtenerUsuarioActual,
    cambiarPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Validaciones para registro
const validacionRegistro = [
    body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('Proporciona un email válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// Rutas públicas
router.post('/registro', validacionRegistro, registro);
router.post('/login', login);
router.post('/admin/login', loginAdmin);

// Rutas protegidas (requieren autenticación)
router.get('/me', protect, obtenerUsuarioActual);
router.put('/cambiar-password', protect, cambiarPassword);

module.exports = router;

