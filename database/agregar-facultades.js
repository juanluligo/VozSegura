require('dotenv').config();
const mysql = require('mysql2/promise');

async function agregarFacultades() {
    console.log('📚 Agregando facultades principales de la universidad\n');

    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || 'vozsegura'
        });

        console.log('✅ Conectado a MySQL\n');

        // Obtener el ID de la primera institución
        const [instituciones] = await connection.query('SELECT id FROM instituciones LIMIT 1');
        
        if (instituciones.length === 0) {
            console.log('❌ No hay instituciones. Creando una...');
            await connection.query(`
                INSERT INTO instituciones (nombre, ciudad) 
                VALUES ('Universidad Nacional', 'Bogotá')
            `);
            const [nuevaInst] = await connection.query('SELECT LAST_INSERT_ID() as id');
            var institucionId = nuevaInst[0].id;
        } else {
            var institucionId = instituciones[0].id;
        }

        console.log(`📍 Institución ID: ${institucionId}\n`);

        // Limpiar facultades existentes
        await connection.query('DELETE FROM facultades');
        console.log('🧹 Facultades anteriores eliminadas\n');

        // Facultades principales de una universidad
        const facultades = [
            'Facultad de Ingeniería',
            'Facultad de Ciencias',
            'Facultad de Ciencias Económicas',
            'Facultad de Derecho y Ciencias Políticas',
            'Facultad de Medicina',
            'Facultad de Ciencias Humanas y Sociales',
            'Facultad de Artes',
            'Facultad de Agronomía',
            'Facultad de Arquitectura y Diseño',
            'Facultad de Enfermería',
            'Facultad de Odontología',
            'Facultad de Veterinaria y Zootecnia',
            'Facultad de Educación',
            'Facultad de Administración',
            'Facultad de Comunicación Social',
            'Facultad de Psicología',
            'Facultad de Trabajo Social',
            'Facultad de Ciencias Ambientales',
            'Facultad de Ciencias de la Salud',
            'Facultad de Lenguas Extranjeras'
        ];

        console.log('📝 Insertando facultades\n');

        for (const facultad of facultades) {
            await connection.query(
                'INSERT INTO facultades (nombre, institucion_id, activa) VALUES (?, ?, ?)',
                [facultad, institucionId, true]
            );
            console.log(`   ✓ ${facultad}`);
        }

        console.log(`\n✅ ${facultades.length} facultades agregadas exitosamente!\n`);

        // Verificar
        const [resultado] = await connection.query('SELECT COUNT(*) as total FROM facultades');
        console.log(`📊 Total de facultades en la base de datos: ${resultado[0].total}\n`);

        // Mostrar algunas facultades
        const [algunasFacultades] = await connection.query(`
            SELECT f.id, f.nombre, i.nombre as institucion
            FROM facultades f
            LEFT JOIN instituciones i ON f.institucion_id = i.id
            LIMIT 10
        `);
        
        console.log('📚 Primeras 10 facultades:\n');
        console.table(algunasFacultades);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

agregarFacultades();
