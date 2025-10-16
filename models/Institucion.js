const { query, queryOne } = require('../config/database');

class Institucion {
    // Crear institución
    static async crear(datos) {
        try {
            const { nombre, ciudad } = datos;
            
            const resultado = await query(
                'INSERT INTO instituciones (nombre, ciudad) VALUES (?, ?)',
                [nombre, ciudad]
            );
            
            return {
                id: resultado.insertId,
                nombre,
                ciudad
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener todas las instituciones
    static async obtenerTodas() {
        try {
            const instituciones = await query(
                'SELECT * FROM instituciones ORDER BY nombre'
            );
            return instituciones;
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar institución por ID
    static async buscarPorId(id) {
        try {
            const institucion = await queryOne(
                'SELECT * FROM instituciones WHERE id = ?',
                [id]
            );
            return institucion;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener facultades de una institución
    static async obtenerFacultades(id) {
        try {
            const facultades = await query(
                'SELECT * FROM facultades WHERE institucion_id = ? AND activa = TRUE ORDER BY nombre',
                [id]
            );
            return facultades;
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar institución
    static async actualizar(id, datos) {
        try {
            const { nombre, ciudad } = datos;
            
            await query(
                'UPDATE instituciones SET nombre = ?, ciudad = ? WHERE id = ?',
                [nombre, ciudad, id]
            );
            
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Institucion;
