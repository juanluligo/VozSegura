const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');

// Middleware para proteger rutas (requiere autenticación)
exports.protect = async (req, res, next) => {
    let token;

    // Verificar si el token viene en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Verificar que existe el token
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado - Token no proporcionado'
        });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal_cambiar');

        console.log('🔑 Token decodificado:', decoded);

        // Buscar usuario - SIEMPRE buscar en la tabla usuarios
        const usuario = await Usuario.buscarPorId(decoded.id);

        console.log('👤 Usuario encontrado en BD:', usuario);

        if (!usuario) {
            console.log('❌ Usuario no encontrado con ID:', decoded.id);
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

        // Agregar información del usuario al request
        req.usuario = {
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            rol: decoded.rol || usuario.rol || 'estudiante',
            tipo: decoded.tipo
        };

        console.log('✅ Usuario autenticado:', req.usuario);

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

    // Verificar si el token viene en el header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Si no hay token, continuar sin usuario
    if (!token) {
        return next();
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_temporal_cambiar');

        // Buscar usuario según el tipo
        let usuario;
        if (decoded.tipo === 'admin') {
            usuario = await Administrador.buscarPorId(decoded.id);
        } else {
            usuario = await Usuario.buscarPorId(decoded.id);
        }

        if (usuario && usuario.activo) {
            req.usuario = {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                tipo: decoded.tipo
            };
        }

        next();
    } catch (error) {
        // Si hay error en el token, continuar sin usuario
        console.log('Token opcional inválido, continuando sin autenticación');
        next();
    }
};
