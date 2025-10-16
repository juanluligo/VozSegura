const { query, queryOne } = require('../config/database');

class Facultad {
    // Crear facultad
    static async crear(datos) {
        try {
            const { nombre, institucion_id } = datos;
            
            const resultado = await query(
                'INSERT INTO facultades (nombre, institucion_id) VALUES (?, ?)',
                [nombre, institucion_id]
            );
            
            return {
                id: resultado.insertId,
                nombre,
                institucion_id
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener todas las facultades
    static async obtenerTodas() {
        try {
            const facultades = await query(
                `SELECT f.*, i.nombre as institucion_nombre, i.ciudad 
                FROM facultades f
                INNER JOIN instituciones i ON f.institucion_id = i.id
                WHERE f.activa = TRUE
                ORDER BY i.nombre, f.nombre`
            );
            return facultades;
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar facultad por ID
    static async buscarPorId(id) {
        try {
            const facultad = await queryOne(
                `SELECT f.*, i.nombre as institucion_nombre, i.ciudad 
                FROM facultades f
                INNER JOIN instituciones i ON f.institucion_id = i.id
                WHERE f.id = ?`,
                [id]
            );
            return facultad;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener estadísticas de denuncias por facultad
    static async obtenerEstadisticas(id) {
        try {
            const stats = await queryOne(
                'SELECT * FROM vista_facultades_denuncias WHERE id = ?',
                [id]
            );
            return stats;
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar facultad
    static async actualizar(id, datos) {
        try {
            const { nombre, institucion_id, activa } = datos;
            
            const campos = [];
            const valores = [];
            
            if (nombre !== undefined) {
                campos.push('nombre = ?');
                valores.push(nombre);
            }
            if (institucion_id !== undefined) {
                campos.push('institucion_id = ?');
                valores.push(institucion_id);
            }
            if (activa !== undefined) {
                campos.push('activa = ?');
                valores.push(activa);
            }
            
            valores.push(id);
            
            await query(
                `UPDATE facultades SET ${campos.join(', ')} WHERE id = ?`,
                valores
            );
            
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Facultad;
