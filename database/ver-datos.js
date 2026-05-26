/**
 * todos los datos guardados en la base de datos
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function verDatos() {
    console.log('\nDATOS GUARDADOS EN LA BASE DE DATOS\n');
    console.log('='.repeat(60));
    
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || 'vozsegura'
        });

        // Ver usuarios
        console.log('\nUSUARIOS REGISTRADOS:\n');
        const [usuarios] = await connection.query(`
            SELECT id, nombre, email, activo 
            FROM usuarios 
            ORDER BY id DESC
        `);
        
        if (usuarios.length > 0) {
            console.table(usuarios);
        } else {
            console.log('No hay usuarios registrados\n');
        }

        // Ver denuncias
        console.log('\nDENUNCIAS:\n');
        const [denuncias] = await connection.query(`
            SELECT 
                d.id,
                d.codigo,
                d.tipo,
                LEFT(d.descripcion, 50) as descripcion_corta,
                d.fecha,
                d.gravedad,
                d.estado,
                u.nombre as usuario,
                f.nombre as facultad
            FROM denuncias d
            LEFT JOIN usuarios u ON d.usuario_id = u.id
            LEFT JOIN facultades f ON d.facultad_id = f.id
            ORDER BY d.id DESC
        `);
        console.table(denuncias);

        // Ver instituciones
        console.log('\nINSTITUCIONES:\n');
        const [instituciones] = await connection.query('SELECT * FROM instituciones');
        console.table(instituciones);

        // Ver facultades
        console.log('\nFACULTADES:\n');
        const [facultades] = await connection.query(`
            SELECT 
                f.id,
                f.nombre,
                i.nombre as institucion,
                f.activa
            FROM facultades f
            LEFT JOIN instituciones i ON f.institucion_id = i.id
        `);
        console.table(facultades);

        // Ver recursos
        console.log('\nRECURSOS DE AYUDA:\n');
        const [recursos] = await connection.query(
            'SELECT id, titulo, descripcion, url, activo FROM recursos'
        );
        console.table(recursos);

        // Estadísticas
        console.log('\nESTADISTICAS:\n');
        const [stats] = await connection.query(`
            SELECT
                (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                (SELECT COUNT(*) FROM denuncias) as total_denuncias,
                (SELECT COUNT(*) FROM denuncias WHERE estado = 'recibida') as denuncias_recibidas,
                (SELECT COUNT(*) FROM denuncias WHERE estado = 'en_proceso') as denuncias_en_proceso,
                (SELECT COUNT(*) FROM denuncias WHERE estado = 'resuelta') as denuncias_resueltas,
                (SELECT COUNT(*) FROM instituciones) as total_instituciones,
                (SELECT COUNT(*) FROM facultades) as total_facultades,
                (SELECT COUNT(*) FROM recursos) as total_recursos
        `);
        console.table(stats);

        console.log('\n' + '='.repeat(60));
        console.log('\nDatos mostrados correctamente\n');

    } catch (error) {
        console.error('\nError:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

verDatos();

