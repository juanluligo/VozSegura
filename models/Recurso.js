const { query, queryOne } = require('../config/database');

class Recurso {
    // Crear recurso
    static async crear(datos) {
        try {
            const { titulo, descripcion, url } = datos;
            
            const resultado = await query(
                'INSERT INTO recursos (titulo, descripcion, url) VALUES (?, ?, ?)',
                [titulo, descripcion, url]
            );
            
            return {
                id: resultado.insertId,
                titulo,
                descripcion,
                url
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener todos los recursos activos
    static async obtenerTodos() {
        try {
            const recursos = await query(
                'SELECT * FROM recursos WHERE activo = TRUE ORDER BY titulo'
            );
            return recursos;
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar recurso por ID
    static async buscarPorId(id) {
        try {
            const recurso = await queryOne(
                'SELECT * FROM recursos WHERE id = ?',
                [id]
            );
            return recurso;
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar recurso
    static async actualizar(id, datos) {
        try {
            const { titulo, descripcion, url, activo } = datos;
            
            const campos = [];
            const valores = [];
            
            if (titulo !== undefined) {
                campos.push('titulo = ?');
                valores.push(titulo);
            }
            if (descripcion !== undefined) {
                campos.push('descripcion = ?');
                valores.push(descripcion);
            }
            if (url !== undefined) {
                campos.push('url = ?');
                valores.push(url);
            }
            if (activo !== undefined) {
                campos.push('activo = ?');
                valores.push(activo);
            }
            
            valores.push(id);
            
            await query(
                `UPDATE recursos SET ${campos.join(', ')} WHERE id = ?`,
                valores
            );
            
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Recurso;
