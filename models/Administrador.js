// En MongoDB los administradores son Usuarios con rol='admin'
// Este archivo redirige al modelo Usuario para compatibilidad con el código existente

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('./Usuario');

// Proxy que expone la misma interfaz que el Administrador original
// pero trabaja sobre la colección de usuarios filtrando por rol='admin'

const Administrador = {
    crear: async (datos) => {
        return await Usuario.crear({ ...datos, rol: 'admin' });
    },

    buscarPorEmail: async (email) => {
        const admin = await Usuario.findOne({ email: email.toLowerCase(), rol: 'admin', activo: true }).lean();
        if (!admin) return null;
        return { ...admin, id: admin._id };
    },

    buscarPorId: async (id) => {
        const admin = await Usuario.findById(id).select('-password -__v').lean();
        if (!admin) return null;
        return { ...admin, id: admin._id };
    },

    verificarPassword: async (passwordPlano, passwordHash) => {
        return await bcrypt.compare(passwordPlano, passwordHash);
    },

    generarJWT: (admin) => {
        return jwt.sign(
            {
                id: admin.id || admin._id,
                email: admin.email,
                rol: 'admin',
                tipo: 'admin'
            },
            process.env.JWT_SECRET || 'secreto_temporal_cambiar',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    },

    obtenerTodos: async () => {
        const admins = await Usuario.find({ rol: 'admin' }).select('-password -__v').sort({ fecha_registro: -1 }).lean();
        return admins.map(a => ({ ...a, id: a._id }));
    }
};

module.exports = Administrador;
