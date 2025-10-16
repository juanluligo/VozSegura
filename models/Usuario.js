const { query, queryOne } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class Usuario {
    // Crear nuevo usuario
    static async crear(datos) {
        try {
            const { nombre, email, password } = datos;
            
            // Verificar si el email ya existe
            const existente = await queryOne(
                'SELECT id FROM usuarios WHERE email = ?',
                [email]
            );
            
            if (existente) {
                throw new Error('El email ya está registrado');
            }
            
            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            
            // Insertar usuario
            const resultado = await query(
                'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
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
    
    // Buscar usuario por email
    static async buscarPorEmail(email) {
        try {
            const usuario = await queryOne(
                'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
                [email]
            );
            return usuario;
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar usuario por ID
    static async buscarPorId(id) {
        try {
            const usuario = await queryOne(
                'SELECT id, nombre, email, fecha_registro, activo FROM usuarios WHERE id = ?',
                [id]
            );
            return usuario;
        } catch (error) {
            throw error;
        }
    }
    
    // Verificar contraseña
    static async verificarPassword(passwordPlano, passwordHash) {
        return await bcrypt.compare(passwordPlano, passwordHash);
    }
    
    // Generar JWT
    static generarJWT(usuario) {
        return jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email,
                tipo: 'usuario'
            },
            process.env.JWT_SECRET || 'secreto_temporal_cambiar',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
    }
    
    // Obtener todos los usuarios
    static async obtenerTodos() {
        try {
            const usuarios = await query(
                'SELECT id, nombre, email, fecha_registro, activo FROM usuarios ORDER BY fecha_registro DESC'
            );
            return usuarios;
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar usuario
    static async actualizar(id, datos) {
        try {
            const { nombre, email } = datos;
            
            await query(
                'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
                [nombre, email, id]
            );
            
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    }
    
    // Desactivar usuario
    static async desactivar(id) {
        try {
            await query(
                'UPDATE usuarios SET activo = FALSE WHERE id = ?',
                [id]
            );
            return { mensaje: 'Usuario desactivado exitosamente' };
        } catch (error) {
            throw error;
        }
    }
    
    // Cambiar contraseña
    static async cambiarPassword(id, passwordNuevo) {
        try {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(passwordNuevo, salt);
            
            await query(
                'UPDATE usuarios SET password = ? WHERE id = ?',
                [passwordHash, id]
            );
            
            return { mensaje: 'Contraseña actualizada exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Usuario;
