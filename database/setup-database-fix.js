require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log('🔧 Configurando base de datos VozSegura...\n');

    let connection;

    try {
        // Conectar a MySQL sin especificar base de datos
        console.log('1️⃣ Conectando a MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });
        console.log('✅ Conectado a MySQL\n');

        // Leer el archivo SQL
        console.log('2️⃣ Leyendo archivo schema.sql...');
        const sqlPath = path.join(__dirname, 'schema.sql');
        let sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('✅ Archivo leído correctamente\n');

        // Limpiar delimiters y separar por procedimientos
        console.log('3️⃣ Procesando script SQL...');
        
        // Quitar comentarios de múltiples líneas y delimiters
        sql = sql.replace(/DELIMITER \/\//g, '');
        sql = sql.replace(/DELIMITER ;/g, '');
        sql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
        
        // Dividir en secciones principales
        const sections = sql.split(/(?=CREATE DATABASE|DROP DATABASE|USE |CREATE TABLE|CREATE PROCEDURE|CREATE VIEW|CREATE TRIGGER|INSERT INTO)/);
        
        console.log(`   Encontradas ${sections.length} secciones SQL\n`);
        
        console.log('4️⃣ Ejecutando script SQL...\n');
        
        let currentSection = '';
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i].trim();
            if (!section) continue;
            
            try {
                // Mostrar progreso
                if (section.startsWith('CREATE DATABASE')) {
                    console.log('   ✓ Creando base de datos...');
                } else if (section.startsWith('DROP DATABASE')) {
                    console.log('   ✓ Eliminando base de datos anterior si existe...');
                } else if (section.startsWith('USE ')) {
                    console.log('   ✓ Seleccionando base de datos...');
                } else if (section.startsWith('CREATE TABLE')) {
                    const tableName = section.match(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?`?(\w+)`?/i)?.[1];
                    console.log(`   ✓ Creando tabla: ${tableName}`);
                } else if (section.startsWith('CREATE PROCEDURE')) {
                    const procName = section.match(/CREATE PROCEDURE\s+`?(\w+)`?/i)?.[1];
                    console.log(`   ✓ Creando procedimiento: ${procName}`);
                } else if (section.startsWith('CREATE VIEW')) {
                    const viewName = section.match(/CREATE VIEW\s+`?(\w+)`?/i)?.[1];
                    console.log(`   ✓ Creando vista: ${viewName}`);
                } else if (section.startsWith('CREATE TRIGGER')) {
                    const triggerName = section.match(/CREATE TRIGGER\s+`?(\w+)`?/i)?.[1];
                    console.log(`   ✓ Creando trigger: ${triggerName}`);
                } else if (section.startsWith('INSERT INTO')) {
                    const tableName = section.match(/INSERT INTO\s+`?(\w+)`?/i)?.[1];
                    console.log(`   ✓ Insertando datos en: ${tableName}`);
                }
                
                currentSection = section;
                await connection.query(section);
                
            } catch (error) {
                console.error(`\n❌ Error en sección: ${error.message}`);
                console.error('Sección que falló:', currentSection.substring(0, 200));
                // Continuar con las siguientes secciones
            }
        }
        
        console.log('\n✅ Script SQL ejecutado\n');

        // Verificar la creación
        console.log('5️⃣ Verificando instalación...');
        await connection.query(`USE ${process.env.DB_NAME || 'vozsegura'}`);
        
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`✅ ${tables.length} tablas creadas:`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   ✓ ${tableName}`);
        });
        console.log('');

        // Contar procedimientos
        const [procedures] = await connection.query(`
            SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_SCHEMA = '${process.env.DB_NAME || 'vozsegura'}' 
            AND ROUTINE_TYPE = 'PROCEDURE'
        `);
        console.log(`✅ ${procedures.length} procedimientos almacenados creados:`);
        procedures.forEach(proc => {
            console.log(`   ✓ ${proc.ROUTINE_NAME}`);
        });
        console.log('');

        // Contar vistas
        const [views] = await connection.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.VIEWS 
            WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'vozsegura'}'
        `);
        console.log(`✅ ${views.length} vistas creadas:`);
        views.forEach(view => {
            console.log(`   ✓ ${view.TABLE_NAME}`);
        });
        console.log('');

        // Contar datos iniciales
        const [instituciones] = await connection.query('SELECT COUNT(*) as total FROM instituciones');
        const [facultades] = await connection.query('SELECT COUNT(*) as total FROM facultades');
        const [recursos] = await connection.query('SELECT COUNT(*) as total FROM recursos');
        const [admins] = await connection.query('SELECT COUNT(*) as total FROM administradores');

        console.log('6️⃣ Datos iniciales cargados:');
        console.log(`   ✓ ${instituciones[0].total} instituciones`);
        console.log(`   ✓ ${facultades[0].total} facultades`);
        console.log(`   ✓ ${recursos[0].total} recursos de ayuda`);
        console.log(`   ✓ ${admins[0].total} administradores`);
        console.log('');

        console.log('✨ ¡BASE DE DATOS CONFIGURADA EXITOSAMENTE! ✨');
        console.log('='.repeat(50));
        console.log('');
        console.log('📝 Próximos pasos:');
        console.log('   1. Ejecuta: npm start');
        console.log('   2. Abre: http://localhost:3000');
        console.log('   3. Login admin: admin@vozsegura.com / Admin123!');
        console.log('   4. Ver datos: http://localhost:3000/views/admin-datos.html');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error durante la configuración:');
        console.error(error.message);
        console.log('\n🔧 Verifica:');
        console.log('   1. MySQL está corriendo');
        console.log('   2. Las credenciales en .env son correctas');
        console.log('   3. El usuario tiene permisos para crear bases de datos');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar setup
setupDatabase();
