const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');
const { validationResult } = require('express-validator');

// Registrar nuevo usuario
// POST /api/auth/registro
// @access  Public
exports.registro = async (req, res) => {
    try {
        // Validar datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { nombre, email, password } = req.body;

        // Crear nuevo usuario
        const usuario = await Usuario.crear({ nombre, email, password });

        // Generar token JWT
        const token = Usuario.generarJWT(usuario);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error al registrar usuario',
            error: error.message
        });
    }
};

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona email y contraseña'
            });
        }

        // Buscar usuario
        const usuario = await Usuario.buscarPorEmail(email);

        console.log('🔍 Usuario encontrado:', {
            id: usuario?.id,
            email: usuario?.email,
            nombre: usuario?.nombre,
            rol: usuario?.rol,
            activo: usuario?.activo
        });

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordCorrecto = await Usuario.verificarPassword(password, usuario.password);

        if (!passwordCorrecto) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar que el usuario esté activo
        if (!usuario.activo) {
            return res.status(403).json({
                success: false,
                message: 'Usuario desactivado. Contacta al administrador'
            });
        }

        // Generar token
        const token = Usuario.generarJWT(usuario);

        const respuesta = {
            success: true,
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol || 'estudiante',
                tipo: usuario.rol === 'admin' ? 'admin' : 'usuario'
            }
        };

        console.log('✅ Respuesta de login:', JSON.stringify(respuesta, null, 2));

        res.status(200).json(respuesta);

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

// @desc    Login de administrador
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona email y contraseña'
            });
        }

        // Buscar administrador
        const admin = await Administrador.buscarPorEmail(email);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordCorrecto = await Administrador.verificarPassword(password, admin.password);

        if (!passwordCorrecto) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        if (!admin.activo) {
            return res.status(403).json({
                success: false,
                message: 'Administrador desactivado'
            });
        }

        // Generar token
        const token = Administrador.generarJWT(admin);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            usuario: {
                id: admin.id,
                nombre: admin.nombre,
                email: admin.email,
                tipo: 'admin'
            }
        });

    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.obtenerUsuarioActual = async (req, res) => {
    try {
        let usuario;
        
        if (req.usuario.tipo === 'admin') {
            usuario = await Administrador.buscarPorId(req.usuario.id);
        } else {
            usuario = await Usuario.buscarPorId(req.usuario.id);
        }

        res.status(200).json({
            success: true,
            usuario: {
                ...usuario,
                tipo: req.usuario.tipo
            }
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener información del usuario',
            error: error.message
        });
    }
};

// @desc    Actualizar contraseña
// @route   PUT /api/auth/cambiar-password
// @access  Private
exports.cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNuevo } = req.body;

        if (!passwordActual || !passwordNuevo) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona la contraseña actual y la nueva'
            });
        }

        let usuario;
        if (req.usuario.tipo === 'admin') {
            usuario = await Administrador.buscarPorEmail(req.usuario.email);
        } else {
            usuario = await Usuario.buscarPorEmail(req.usuario.email);
        }

        // Verificar contraseña actual
        const Model = req.usuario.tipo === 'admin' ? Administrador : Usuario;
        const passwordCorrecto = await Model.verificarPassword(passwordActual, usuario.password);

        if (!passwordCorrecto) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }

        // Actualizar contraseña
        await Usuario.cambiarPassword(req.usuario.id, passwordNuevo);

        const token = Model.generarJWT(usuario);

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente',
            token
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};

// Crear admin inicial
exports.crearAdminInicial = async (req, res) => {
    try {
        const bcrypt = require('bcryptjs');
        const db = require('../config/database');

        const email = 'admin@vozsegura.com';
        const password = 'admin123';
        const nombre = 'Administrador';

        // Verificar si ya existe
        const [existente] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        
        if (existente.length > 0) {
            // Si existe, hacerlo admin
            await db.query('UPDATE usuarios SET rol = ? WHERE email = ?', ['admin', email]);
            return res.json({
                success: true,
                message: 'Usuario existente actualizado a admin',
                credentials: { email, password: 'admin123' }
            });
        }

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear admin
        await db.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, 'admin']
        );

        res.json({
            success: true,
            message: 'Admin creado exitosamente',
            credentials: {
                email: 'admin@vozsegura.com',
                password: 'admin123'
            }
        });

    } catch (error) {
        console.error('Error creando admin:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
