const { query, queryOne, getPool } = require('../config/database');

class Denuncia {
    // Crear nueva denuncia usando procedimiento almacenado
    static async crear(datos) {
        try {
            const { tipo, descripcion, fecha, gravedad, usuario_id, facultad_id } = datos;
            
            const pool = getPool();
            const connection = await pool.getConnection();
            
            try {
                // Llamar al procedimiento almacenado
                const [results] = await connection.query(
                    'CALL sp_crear_denuncia(?, ?, ?, ?, ?, ?, @codigo, @denuncia_id)',
                    [tipo, descripcion, fecha, gravedad || 'media', usuario_id, facultad_id]
                );
                
                // Obtener valores de salida
                const [output] = await connection.query('SELECT @codigo as codigo, @denuncia_id as id');
                
                connection.release();
                
                return {
                    id: output[0].id,
                    codigo: output[0].codigo,
                    tipo,
                    descripcion,
                    fecha,
                    estado: 'recibida',
                    gravedad: gravedad || 'media'
                };
            } catch (error) {
                connection.release();
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener denuncias de un usuario
    static async obtenerPorUsuario(usuario_id) {
        try {
            const pool = getPool();
            const [denuncias] = await pool.query('CALL sp_obtener_denuncias_usuario(?)', [usuario_id]);
            return denuncias[0] || [];
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener denuncia por ID con información completa
    static async buscarPorId(id) {
        try {
            const denuncia = await queryOne(
                `SELECT 
                    d.*,
                    u.nombre AS usuario_nombre,
                    u.email AS usuario_email,
                    f.nombre AS facultad_nombre,
                    i.nombre AS institucion_nombre,
                    i.ciudad AS institucion_ciudad
                FROM denuncias d
                LEFT JOIN usuarios u ON d.usuario_id = u.id
                LEFT JOIN facultades f ON d.facultad_id = f.id
                LEFT JOIN instituciones i ON f.institucion_id = i.id
                WHERE d.id = ?`,
                [id]
            );
            
            if (!denuncia) return null;
            
            // Obtener archivos adjuntos
            const archivos = await query(
                'SELECT * FROM archivos WHERE denuncia_id = ?',
                [id]
            );
            
            // Obtener seguimiento
            const seguimiento = await query(
                `SELECT s.*, a.nombre as admin_nombre
                FROM seguimiento_denuncia s
                LEFT JOIN administradores a ON s.admin_id = a.id
                WHERE s.denuncia_id = ?
                ORDER BY s.fecha DESC`,
                [id]
            );
            
            // Obtener recursos asignados
            const recursos = await query(
                `SELECT r.* 
                FROM recursos r
                INNER JOIN denuncia_recurso dr ON r.id = dr.recurso_id
                WHERE dr.denuncia_id = ?`,
                [id]
            );
            
            return {
                ...denuncia,
                archivos,
                seguimiento,
                recursos
            };
        } catch (error) {
            throw error;
        }
    }
    
    // Buscar denuncia por código
    static async buscarPorCodigo(codigo) {
        try {
            const denuncia = await queryOne(
                'SELECT * FROM denuncias WHERE codigo = ?',
                [codigo]
            );
            
            if (denuncia) {
                return await this.buscarPorId(denuncia.id);
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener todas las denuncias (vista completa)
    static async obtenerTodas(filtros = {}) {
        try {
            let sql = 'SELECT * FROM vista_denuncias_completas';
            const condiciones = [];
            const params = [];
            
            if (filtros.estado) {
                condiciones.push('estado = ?');
                params.push(filtros.estado);
            }
            
            if (filtros.gravedad) {
                condiciones.push('gravedad = ?');
                params.push(filtros.gravedad);
            }
            
            if (filtros.facultad_id) {
                condiciones.push('facultad_id = ?');
                params.push(filtros.facultad_id);
            }
            
            if (condiciones.length > 0) {
                sql += ' WHERE ' + condiciones.join(' AND ');
            }
            
            sql += ' ORDER BY fecha_creacion DESC';
            
            if (filtros.limite) {
                sql += ` LIMIT ${parseInt(filtros.limite)}`;
            }
            
            const denuncias = await query(sql, params);
            return denuncias;
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar estado de denuncia
    static async actualizarEstado(id, admin_id, nuevo_estado, comentario = '') {
        try {
            const pool = getPool();
            await pool.query(
                'CALL sp_actualizar_estado_denuncia(?, ?, ?, ?)',
                [id, admin_id, nuevo_estado, comentario]
            );
            
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    }
    
    // Actualizar denuncia
    static async actualizar(id, datos) {
        try {
            const { tipo, descripcion, fecha, gravedad, facultad_id } = datos;
            
            await query(
                `UPDATE denuncias 
                SET tipo = ?, descripcion = ?, fecha = ?, gravedad = ?, facultad_id = ?
                WHERE id = ?`,
                [tipo, descripcion, fecha, gravedad, facultad_id, id]
            );
            
            return await this.buscarPorId(id);
        } catch (error) {
            throw error;
        }
    }
    
    // Agregar archivo a denuncia
    static async agregarArchivo(denuncia_id, archivo) {
        try {
            const { nombre, tipo, ruta, tamano_kb } = archivo;
            
            const resultado = await query(
                'INSERT INTO archivos (denuncia_id, nombre, tipo, ruta, tamano_kb) VALUES (?, ?, ?, ?, ?)',
                [denuncia_id, nombre, tipo, ruta, tamano_kb || 0]
            );
            
            return { id: resultado.insertId, ...archivo };
        } catch (error) {
            throw error;
        }
    }
    
    // Asignar recursos
    static async asignarRecursos(denuncia_id, recursos_ids) {
        try {
            const pool = getPool();
            await pool.query(
                'CALL sp_asignar_recursos_denuncia(?, ?)',
                [denuncia_id, recursos_ids.join(',')]
            );
            
            return { mensaje: 'Recursos asignados exitosamente' };
        } catch (error) {
            throw error;
        }
    }
    
    // Registrar atención
    static async registrarAtencion(datos) {
        try {
            const { denuncia_id, usuario_id, admin_id, tipo_atencion, modalidad, descripcion } = datos;
            
            const pool = getPool();
            await pool.query(
                'CALL sp_registrar_atencion(?, ?, ?, ?, ?, ?)',
                [denuncia_id, usuario_id, admin_id, tipo_atencion, modalidad || 'virtual', descripcion]
            );
            
            return { mensaje: 'Atención registrada exitosamente' };
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener estadísticas generales
    static async obtenerEstadisticas() {
        try {
            const pool = getPool();
            const [stats] = await pool.query('CALL sp_estadisticas_generales()');
            return stats[0][0];
        } catch (error) {
            throw error;
        }
    }
    
    // Eliminar denuncia
    static async eliminar(id) {
        try {
            await query('DELETE FROM denuncias WHERE id = ?', [id]);
            return { mensaje: 'Denuncia eliminada exitosamente' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Denuncia;
