const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function permitirDenunciasAnonimas() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1904',
        database: process.env.DB_NAME || 'vozsegura'
    });

    try {
        console.log('Conectado a la base de datos...');

        // 1. Eliminar la restricción de clave foránea existente
        console.log('Eliminando restricción de clave foránea...');
        await connection.query(`
            ALTER TABLE denuncias
            DROP FOREIGN KEY denuncias_ibfk_1;
        `);

        // 2. Modificar la columna usuario_id para permitir NULL
        console.log('Modificando columna usuario_id para permitir NULL...');
        await connection.query(`
            ALTER TABLE denuncias
            MODIFY usuario_id INT NULL;
        `);

        // 3. Agregar de nuevo la restricción de clave foránea con ON DELETE SET NULL
        console.log('Agregando nueva restricción de clave foránea...');
        await connection.query(`
            ALTER TABLE denuncias
            ADD CONSTRAINT denuncias_ibfk_1
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;
        `);

        // 4. Actualizar el procedimiento almacenado sp_crear_denuncia
        console.log('Actualizando procedimiento almacenado sp_crear_denuncia...');
        await connection.query('DROP PROCEDURE IF EXISTS sp_crear_denuncia;');
        
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
                
                -- Generar código único
                SET v_codigo = CONCAT('DEN', YEAR(p_fecha), LPAD(FLOOR(RAND() * 999999), 6, '0'));
                
                -- Verificar que el código no exista
                WHILE EXISTS(SELECT 1 FROM denuncias WHERE codigo = v_codigo) DO
                    SET v_codigo = CONCAT('DEN', YEAR(p_fecha), LPAD(FLOOR(RAND() * 999999), 6, '0'));
                END WHILE;
                
                -- Insertar denuncia (usuario_id puede ser NULL)
                INSERT INTO denuncias (codigo, tipo, descripcion, fecha, gravedad, usuario_id, facultad_id, estado)
                VALUES (v_codigo, p_tipo, p_descripcion, p_fecha, p_gravedad, p_usuario_id, p_facultad_id, 'recibida');
                
                SET p_codigo = v_codigo;
                SET p_denuncia_id = LAST_INSERT_ID();
                
                -- Registrar en log solo si hay usuario
                IF p_usuario_id IS NOT NULL THEN
                    INSERT INTO log_accion (usuario_id, accion, descripcion)
                    VALUES (p_usuario_id, 'CREAR_DENUNCIA', CONCAT('Denuncia creada: ', v_codigo));
                END IF;
            END
        `);

        console.log('\n✅ Migración completada exitosamente!');
        console.log('Ahora el sistema permite denuncias anónimas.');

    } catch (error) {
        console.error('❌ Error durante la migración:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

// Ejecutar la migración
permitirDenunciasAnonimas()
    .then(() => {
        console.log('\nProceso completado.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\nError fatal:', error);
        process.exit(1);
    });
