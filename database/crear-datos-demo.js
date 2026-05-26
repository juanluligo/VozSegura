const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function crearDatosDemo() {
    console.log('\n=================================================');
    console.log('    CREANDO DATOS DE PRUEBA PARA DEMO');
    console.log('=================================================\n');

    let connection;

    try {
        // Conectar a MySQL
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            database: process.env.DB_NAME || 'vozsegura'
        });

        console.log('✓ Conectado a MySQL\n');

        // Crear usuarios de prueba
        console.log('1. Creando usuarios de prueba...');
        
        const usuariosPrueba = [
            { nombre: 'María González', email: 'maria@ejemplo.com', password: '123456', rol: 'estudiante' },
            { nombre: 'Juan Pérez', email: 'juan@ejemplo.com', password: '123456', rol: 'estudiante' },
            { nombre: 'Ana Torres', email: 'ana@ejemplo.com', password: '123456', rol: 'docente' }
        ];

        for (const usuario of usuariosPrueba) {
            const passwordHash = await bcrypt.hash(usuario.password, 10);
            
            try {
                await connection.query(
                    'INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, 1)',
                    [usuario.nombre, usuario.email, passwordHash, usuario.rol]
                );
                console.log(`   ✓ Usuario creado: ${usuario.email}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`   ⚠ Usuario ya existe: ${usuario.email}`);
                } else {
                    throw err;
                }
            }
        }

        // Obtener IDs de usuarios
        const [usuarios] = await connection.query('SELECT id, nombre FROM usuarios WHERE rol != "admin"');
        
        if (usuarios.length === 0) {
            console.log('\n⚠ No hay usuarios disponibles. Crea usuarios primero.\n');
            return;
        }

        // Crear denuncias de prueba
        console.log('\n2. Creando denuncias de prueba...');

        const denunciasPrueba = [
            {
                tipo: 'Acoso verbal',
                descripcion: 'Durante la clase de matemáticas, un compañero me hizo comentarios ofensivos sobre mi apariencia física de manera repetida. Esto ha afectado mi concentración y asistencia a clases.',
                gravedad: 'media',
                facultad_id: 1,
                fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // Hace 5 días
            },
            {
                tipo: 'Discriminación',
                descripcion: 'Fui excluido de un proyecto grupal por mi orientación sexual. Los demás miembros del grupo se negaron a trabajar conmigo y el docente no intervino.',
                gravedad: 'alta',
                facultad_id: 2,
                fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // Hace 10 días
            },
            {
                tipo: 'Acoso sexual',
                descripcion: 'Un docente me ha enviado mensajes inapropiados por redes sociales fuera del horario de clases. Me siento muy incómoda y no sé cómo actuar.',
                gravedad: 'alta',
                facultad_id: 3,
                fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Hace 3 días
            },
            {
                tipo: 'Abuso de autoridad',
                descripcion: 'Un profesor amenazó con reprobarme si no realizaba trabajos adicionales no relacionados con la materia, específicamente tareas personales.',
                gravedad: 'alta',
                facultad_id: 1,
                fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Hace 7 días
            },
            {
                tipo: 'Violencia psicológica',
                descripcion: 'Un compañero de clase constantemente me ridiculiza frente a otros estudiantes, criticando mis opiniones y respuestas en clase de manera humillante.',
                gravedad: 'media',
                facultad_id: 4,
                fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Hace 2 días
            },
            {
                tipo: 'Acoso físico',
                descripcion: 'En el pasillo de la facultad, un grupo de estudiantes me empujó intencionalmente, causándome caer y lastimar mi brazo. Esto ha ocurrido más de una vez.',
                gravedad: 'alta',
                facultad_id: 2,
                fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // Hace 15 días
            }
        ];

        let denunciasCreadas = 0;

        for (let i = 0; i < denunciasPrueba.length; i++) {
            const denuncia = denunciasPrueba[i];
            const usuario = usuarios[i % usuarios.length]; // Distribuir entre usuarios
            
            try {
                const fechaStr = denuncia.fecha.toISOString().split('T')[0];
                
                await connection.query(
                    'CALL sp_crear_denuncia(?, ?, ?, ?, ?, ?, @codigo, @id)',
                    [
                        denuncia.tipo,
                        denuncia.descripcion,
                        fechaStr,
                        denuncia.gravedad,
                        usuario.id,
                        denuncia.facultad_id
                    ]
                );

                const [result] = await connection.query('SELECT @codigo as codigo, @id as id');
                console.log(`   ✓ Denuncia #${i + 1}: ${result[0].codigo} (${denuncia.tipo})`);
                denunciasCreadas++;

                // Actualizar algunos estados para demo
                if (i === 0) {
                    // Primera denuncia: En revisión
                    await connection.query(
                        'UPDATE denuncias SET estado = "en_revision" WHERE id = ?',
                        [result[0].id]
                    );
                } else if (i === 1) {
                    // Segunda denuncia: En proceso
                    await connection.query(
                        'UPDATE denuncias SET estado = "en_proceso" WHERE id = ?',
                        [result[0].id]
                    );
                } else if (i === 5) {
                    // Sexta denuncia: Resuelta
                    await connection.query(
                        'UPDATE denuncias SET estado = "resuelta" WHERE id = ?',
                        [result[0].id]
                    );
                }

            } catch (err) {
                console.log(`   ✗ Error en denuncia #${i + 1}: ${err.message}`);
            }
        }

        console.log(`\n✓ ${denunciasCreadas} denuncias creadas exitosamente`);

        // Mostrar códigos para pruebas
        console.log('\n3. Códigos de denuncias para pruebas:');
        const [denuncias] = await connection.query(`
            SELECT d.codigo, d.tipo, d.estado, u.nombre as usuario
            FROM denuncias d
            LEFT JOIN usuarios u ON d.usuario_id = u.id
            ORDER BY d.id DESC
            LIMIT 10
        `);

        console.table(denuncias);

        console.log('\n=================================================');
        console.log('  ✓ DATOS DE DEMO CREADOS EXITOSAMENTE');
        console.log('=================================================\n');
        console.log('Puedes usar estos códigos para probar la consulta pública\n');

    } catch (error) {
        console.error('\n✗ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar
crearDatosDemo();
