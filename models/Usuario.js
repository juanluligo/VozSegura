const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: 6
    },
    rol: {
        type: String,
        enum: ['estudiante', 'docente', 'admin'],
        default: 'estudiante'
    },
    activo: {
        type: Boolean,
        default: true
    },
    fecha_registro: {
        type: Date,
        default: Date.now
    }
});

// Hash password antes de guardar
usuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Métodos estáticos que mantienen la misma interfaz que el modelo MySQL anterior

// Crear nuevo usuario
usuarioSchema.statics.crear = async function (datos) {
    const { nombre, email, password, rol } = datos;

    const existente = await this.findOne({ email: email.toLowerCase() });
    if (existente) throw new Error('El email ya está registrado');

    const usuario = await this.create({ nombre, email, password, rol: rol || 'estudiante' });

    return {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
    };
};

// Buscar por email (devuelve el doc completo con password para verificación)
usuarioSchema.statics.buscarPorEmail = async function (email) {
    const usuario = await this.findOne({ email: email.toLowerCase(), activo: true }).lean();
    if (!usuario) return null;
    return { ...usuario, id: usuario._id };
};

// Buscar por ID
usuarioSchema.statics.buscarPorId = async function (id) {
    const usuario = await this.findById(id).select('-password -__v').lean();
    if (!usuario) return null;
    return { ...usuario, id: usuario._id };
};

// Verificar contraseña
usuarioSchema.statics.verificarPassword = async function (passwordPlano, passwordHash) {
    return await bcrypt.compare(passwordPlano, passwordHash);
};

// Generar JWT
usuarioSchema.statics.generarJWT = function (usuario) {
    return jwt.sign(
        {
            id: usuario.id || usuario._id,
            email: usuario.email,
            rol: usuario.rol || 'estudiante',
            tipo: usuario.rol === 'admin' ? 'admin' : 'usuario'
        },
        process.env.JWT_SECRET || 'secreto_temporal_cambiar',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Obtener todos
usuarioSchema.statics.obtenerTodos = async function () {
    const usuarios = await this.find().select('-password -__v').sort({ fecha_registro: -1 }).lean();
    return usuarios.map(u => ({ ...u, id: u._id }));
};

// Actualizar usuario
usuarioSchema.statics.actualizar = async function (id, datos) {
    const { nombre, email, rol, activo } = datos;
    const update = {};
    if (nombre !== undefined) update.nombre = nombre;
    if (email !== undefined) update.email = email.toLowerCase();
    if (rol !== undefined) update.rol = rol;
    if (activo !== undefined) update.activo = activo;

    const usuario = await this.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        .select('-password -__v').lean();
    return { ...usuario, id: usuario._id };
};

// Eliminar usuario
usuarioSchema.statics.eliminar = async function (id) {
    await this.findByIdAndDelete(id);
    return { mensaje: 'Usuario eliminado exitosamente' };
};

// Cambiar estado
usuarioSchema.statics.cambiarEstado = async function (id, activo) {
    await this.findByIdAndUpdate(id, { activo });
    return { mensaje: `Usuario ${activo ? 'activado' : 'desactivado'} exitosamente` };
};

// Cambiar contraseña
usuarioSchema.statics.cambiarPassword = async function (id, passwordNuevo) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordNuevo, salt);
    await this.findByIdAndUpdate(id, { password: passwordHash });
    return { mensaje: 'Contraseña actualizada exitosamente' };
};

module.exports = mongoose.model('Usuario', usuarioSchema);
