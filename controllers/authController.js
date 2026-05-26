const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');
const { validationResult } = require('express-validator');

// POST /api/auth/registro
exports.registro = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { nombre, email, password } = req.body;
        const usuario = await Usuario.crear({ nombre, email, password });
        const token = Usuario.generarJWT(usuario);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ success: false, message: error.message || 'Error al registrar usuario' });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Por favor proporciona email y contraseña' });
        }

        const usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const passwordCorrecto = await Usuario.verificarPassword(password, usuario.password);
        if (!passwordCorrecto) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        if (!usuario.activo) {
            return res.status(403).json({ success: false, message: 'Usuario desactivado. Contacta al administrador' });
        }

        const token = Usuario.generarJWT(usuario);

        res.status(200).json({
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
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
    }
};

// POST /api/auth/admin/login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Por favor proporciona email y contraseña' });
        }

        const admin = await Administrador.buscarPorEmail(email);

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const passwordCorrecto = await Administrador.verificarPassword(password, admin.password);
        if (!passwordCorrecto) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        if (!admin.activo) {
            return res.status(403).json({ success: false, message: 'Administrador desactivado' });
        }

        const token = Administrador.generarJWT(admin);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            token,
            usuario: { id: admin.id, nombre: admin.nombre, email: admin.email, tipo: 'admin' }
        });
    } catch (error) {
        console.error('Error en login admin:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
    }
};

// GET /api/auth/me
exports.obtenerUsuarioActual = async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.usuario.id);
        res.status(200).json({
            success: true,
            usuario: { ...usuario, tipo: req.usuario.tipo }
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener información del usuario' });
    }
};

// PUT /api/auth/cambiar-password
exports.cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNuevo } = req.body;

        if (!passwordActual || !passwordNuevo) {
            return res.status(400).json({ success: false, message: 'Por favor proporciona la contraseña actual y la nueva' });
        }

        const usuario = await Usuario.buscarPorEmail(req.usuario.email);
        const passwordCorrecto = await Usuario.verificarPassword(passwordActual, usuario.password);

        if (!passwordCorrecto) {
            return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
        }

        await Usuario.cambiarPassword(req.usuario.id, passwordNuevo);
        const token = Usuario.generarJWT(usuario);

        res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente', token });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ success: false, message: 'Error al cambiar contraseña' });
    }
};

// POST /api/auth/crear-admin-inicial
exports.crearAdminInicial = async (req, res) => {
    try {
        const email = 'admin@vozsegura.com';
        const password = 'admin123';
        const nombre = 'Administrador';

        const existente = await Usuario.findOne({ email });
        if (existente) {
            await Usuario.findOneAndUpdate({ email }, { rol: 'admin' });
            return res.json({
                success: true,
                message: 'Usuario existente actualizado a admin',
                credentials: { email, password: 'admin123' }
            });
        }

        await Usuario.crear({ nombre, email, password, rol: 'admin' });

        res.json({
            success: true,
            message: 'Admin creado exitosamente',
            credentials: { email: 'admin@vozsegura.com', password: 'admin123' }
        });
    } catch (error) {
        console.error('Error creando admin:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/auth/usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.obtenerTodos();
        res.status(200).json({
            success: true,
            total: usuarios.length,
            usuarios: usuarios.map(u => ({
                id: u.id,
                nombre: u.nombre,
                email: u.email,
                rol: u.rol,
                activo: u.activo,
                fecha_registro: u.fecha_registro
            }))
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuarios' });
    }
};

// GET /api/auth/usuarios/:id
exports.obtenerUsuarioPorId = async (req, res) => {
    try {
        const usuario = await Usuario.buscarPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener usuario' });
    }
};

// POST /api/auth/usuarios
exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ success: false, message: 'Por favor proporciona nombre, email y password' });
        }

        const usuarioExistente = await Usuario.buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }

        const usuario = await Usuario.crear({ nombre, email, password, rol: rol || 'estudiante' });
        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol || 'estudiante' }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
};

// PUT /api/auth/usuarios/:id
exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, rol, activo } = req.body;

        const usuario = await Usuario.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (email && email !== usuario.email) {
            const emailExiste = await Usuario.buscarPorEmail(email);
            if (emailExiste) {
                return res.status(400).json({ success: false, message: 'El email ya está en uso' });
            }
        }

        const usuarioActualizado = await Usuario.actualizar(id, { nombre, email, rol, activo });
        res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente', usuario: usuarioActualizado });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
    }
};

// DELETE /api/auth/usuarios/:id
exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (id.toString() === req.usuario.id.toString()) {
            return res.status(400).json({ success: false, message: 'No puedes eliminar tu propia cuenta' });
        }

        await Usuario.eliminar(id);
        res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
    }
};

// PATCH /api/auth/usuarios/:id/estado
exports.cambiarEstadoUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;

        if (typeof activo !== 'boolean') {
            return res.status(400).json({ success: false, message: 'El campo activo debe ser true o false' });
        }

        const usuario = await Usuario.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (id.toString() === req.usuario.id.toString()) {
            return res.status(400).json({ success: false, message: 'No puedes cambiar tu propio estado' });
        }

        await Usuario.cambiarEstado(id, activo);
        res.status(200).json({ success: true, message: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente` });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({ success: false, message: 'Error al cambiar estado del usuario' });
    }
};
