require('dotenv').config();
const mysql = require('mysql2/promise');

async function crearProcedimientos() {
    console.log('🔧 Creando procedimientos almacenados...\n');

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

        // Procedimiento 1: Crear denuncia
        console.log('1️⃣ Creando sp_crear_denuncia...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_crear_denuncia');
        await connection.query(`
            CREATE PROCEDURE sp_crear_denuncia(
                IN p_tipo VARCHAR(50),
                IN p_descripcion TEXT,
                IN p_fecha DATE,
                IN p_gravedad VARCHAR(20),
                IN p_usuario_id INT,
                IN p_facultad_id INT,
                OUT p_codigo VARCHAR(20),
                OUT p_denuncia_id INT
            )
            BEGIN
                DECLARE v_codigo VARCHAR(20);
                DECLARE v_contador INT;
                
                SELECT COUNT(*) + 1 INTO v_contador FROM denuncias WHERE YEAR(fecha_creacion) = YEAR(CURDATE());
                SET v_codigo = CONCAT('DEN-', YEAR(CURDATE()), LPAD(v_contador, 6, '0'));
                
                INSERT INTO denuncias (codigo, tipo, descripcion, fecha, gravedad, usuario_id, facultad_id, estado)
                VALUES (v_codigo, p_tipo, p_descripcion, p_fecha, p_gravedad, p_usuario_id, p_facultad_id, 'recibida');
                
                SET p_codigo = v_codigo;
                SET p_denuncia_id = LAST_INSERT_ID();
            END
        `);
        console.log('✅ sp_crear_denuncia creado\n');

        // Procedimiento 2: Actualizar estado
        console.log('2️⃣ Creando sp_actualizar_estado_denuncia...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_actualizar_estado_denuncia');
        await connection.query(`
            CREATE PROCEDURE sp_actualizar_estado_denuncia(
                IN p_denuncia_id INT,
                IN p_admin_id INT,
                IN p_nuevo_estado VARCHAR(30),
                IN p_comentario TEXT
            )
            BEGIN
                DECLARE v_estado_anterior VARCHAR(30);
                
                SELECT estado INTO v_estado_anterior FROM denuncias WHERE id = p_denuncia_id;
                
                UPDATE denuncias
                SET estado = p_nuevo_estado, fecha_actualizacion = NOW()
                WHERE id = p_denuncia_id;
            END
        `);
        console.log('✅ sp_actualizar_estado_denuncia creado\n');

        // Procedimiento 3: Registrar atención
        console.log('3️⃣ Creando sp_registrar_atencion...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_registrar_atencion');
        await connection.query(`
            CREATE PROCEDURE sp_registrar_atencion(
                IN p_denuncia_id INT,
                IN p_profesional VARCHAR(100),
                IN p_tipo VARCHAR(50),
                IN p_observaciones TEXT,
                IN p_proxima_cita DATETIME
            )
            BEGIN
                -- Este procedimiento se puede implementar cuando se tenga la tabla de atenciones
                SELECT 'Procedimiento registrar_atencion pendiente de implementación' as mensaje;
            END
        `);
        console.log('✅ sp_registrar_atencion creado\n');

        // Procedimiento 4: Estadísticas generales
        console.log('4️⃣ Creando sp_estadisticas_generales...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_estadisticas_generales');
        await connection.query(`
            CREATE PROCEDURE sp_estadisticas_generales()
            BEGIN
                SELECT
                    (SELECT COUNT(*) FROM denuncias) as total_denuncias,
                    (SELECT COUNT(*) FROM denuncias WHERE estado = 'recibida') as denuncias_recibidas,
                    (SELECT COUNT(*) FROM denuncias WHERE estado = 'en_proceso') as denuncias_proceso,
                    (SELECT COUNT(*) FROM denuncias WHERE estado = 'resuelta') as denuncias_resueltas,
                    (SELECT COUNT(*) FROM denuncias WHERE estado = 'rechazada') as denuncias_rechazadas,
                    (SELECT COUNT(*) FROM usuarios) as total_usuarios;
            END
        `);
        console.log('✅ sp_estadisticas_generales creado\n');

        // Crear el administrador si no existe
        console.log('5️⃣ Creando administrador por defecto...');
        const [adminExists] = await connection.query('SELECT id FROM administradores WHERE email = ?', ['admin@vozsegura.com']);
        
        if (adminExists.length === 0) {
            // Password: Admin123! (ya hasheado con bcrypt)
            const hashedPassword = '$2a$10$XqKXz5RZ5yzYEKqZxMxQHO7hJmX7v8aJqq5kN8UUJ3CW5Jz2Bb8Vu';
            await connection.query(
                'INSERT INTO administradores (nombre, email, password) VALUES (?, ?, ?)',
                ['Administrador Principal', 'admin@vozsegura.com', hashedPassword]
            );
            console.log('✅ Administrador creado: admin@vozsegura.com / Admin123!\n');
        } else {
            console.log('✅ Administrador ya existe\n');
        }

        console.log('✨ ¡PROCEDIMIENTOS CREADOS EXITOSAMENTE! ✨\n');
        console.log('📝 Todo listo para ejecutar: npm start\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

crearProcedimientos();
