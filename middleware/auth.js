const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para proteger rutas (requiere autenticación)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado - Token no proporcionado'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal_cambiar');

        const usuario = await Usuario.buscarPorId(decoded.id);

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (!usuario.activo) {
            return res.status(403).json({
                success: false,
                message: 'Usuario desactivado'
            });
        }

        req.usuario = {
            id: usuario.id || usuario._id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: decoded.rol || usuario.rol || 'estudiante',
            tipo: decoded.tipo
        };

        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        return res.status(401).json({
            success: false,
            message: 'No autorizado - Token inválido'
        });
    }
};

// Middleware para autorizar solo administradores
exports.isAdmin = (req, res, next) => {
    if (req.usuario.rol !== 'admin' && req.usuario.tipo !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }
    next();
};

// Middleware de autenticación opcional
exports.optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal_cambiar');
        const usuario = await Usuario.buscarPorId(decoded.id);

        if (usuario && usuario.activo) {
            req.usuario = {
                id: usuario.id || usuario._id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: decoded.rol || usuario.rol || 'estudiante',
                tipo: decoded.tipo
            };
        }
        next();
    } catch (error) {
        next();
    }
};
