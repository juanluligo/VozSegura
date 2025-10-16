const { query, queryOne } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Administrador {
    // Crear nuevo administrador
    static async crear(datos) {
        try {
            const { nombre, email, password } = datos;
            
            // Verificar si el email ya existe
            const existente = await queryOne(
                'SELECT id FROM administradores WHERE email = ?',
                [email]
            );
            
            if (existente) {
                throw new Error('El email ya está registrado');
            }
            
            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            // Insertar administrador
            const resultado = await query(
                'INSERT INTO administradores (nombre, email, password) VALUES (?, ?, ?)',
                [nombre, email, passwordHash]
            );
            
            return {
                id: resultado.insertId,
                nombre,
                email
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar administrador por email
    static async buscarPorEmail(email) {
        try {
            const admin = await queryOne(
                'SELECT * FROM administradores WHERE email = ? AND activo = TRUE',
                [email]
            );
            return admin;
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar administrador por ID
    static async buscarPorId(id) {
        try {
            const admin = await queryOne(
                'SELECT id, nombre, email, fecha_creacion, activo FROM administradores WHERE id = ?',
                [id]
            );
            return admin;
        } catch (error) {
            throw error;
        }
    }
    
    // Verificar contraseña
    static async verificarPassword(passwordPlano, passwordHash) {
        return await bcrypt.compare(passwordPlano, passwordHash);
    }
    
    // Generar JWT
    static generarJWT(admin) {
        return jwt.sign(
            { 
                id: admin.id, 
                email: admin.email,
                tipo: 'admin'
            },
            process.env.JWT_SECRET || 'secreto_temporal_cambiar',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }
    
    // Obtener todos los administradores
    static async obtenerTodos() {
        try {
            const admins = await query(
                'SELECT id, nombre, email, fecha_creacion, activo FROM administradores ORDER BY fecha_creacion DESC'
            );
            return admins;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener actividad de administrador
    static async obtenerActividad(id) {
        try {
            const actividad = await queryOne(
                'SELECT * FROM vista_actividad_admins WHERE id = ?',
                [id]
            );
            return actividad;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Administrador;
