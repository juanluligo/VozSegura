const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    registro,
    login,
    loginAdmin,
    obtenerUsuarioActual,
    cambiarPassword,
    crearAdminInicial,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cambiarEstadoUsuario
} = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

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
router.post('/crear-admin-inicial', crearAdminInicial);

// Rutas protegidas (requieren autenticación)
router.get('/me', protect, obtenerUsuarioActual);
router.put('/cambiar-password', protect, cambiarPassword);

// Rutas de gestión de usuarios (Solo Admin)
router.get('/usuarios', protect, isAdmin, obtenerUsuarios);
router.get('/usuarios/:id', protect, isAdmin, obtenerUsuarioPorId);
router.post('/usuarios', protect, isAdmin, crearUsuario);
router.put('/usuarios/:id', protect, isAdmin, actualizarUsuario);
router.delete('/usuarios/:id', protect, isAdmin, eliminarUsuario);
router.patch('/usuarios/:id/estado', protect, isAdmin, cambiarEstadoUsuario);

module.exports = router;

