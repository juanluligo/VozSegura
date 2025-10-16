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
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        console.log('✅ Conectado a MySQL\n');

        // Leer el archivo SQL
        console.log('2️⃣ Leyendo archivo schema.sql...');
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('✅ Archivo leído correctamente\n');

        // Ejecutar el script SQL
        console.log('3️⃣ Ejecutando script SQL...');
        console.log('   (Esto puede tomar unos segundos)\n');
        
        await connection.query(sql);
        
        console.log('✅ Base de datos creada exitosamente\n');

        // Verificar la creación
        console.log('4️⃣ Verificando instalación...');
        await connection.query(`USE ${process.env.DB_NAME || 'vozsegura'}`);
        
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`✅ ${tables.length} tablas creadas:`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   ✓ ${tableName}`);
        });
        console.log('');

        // Contar datos iniciales
        const [instituciones] = await connection.query('SELECT COUNT(*) as total FROM instituciones');
        const [facultades] = await connection.query('SELECT COUNT(*) as total FROM facultades');
        const [recursos] = await connection.query('SELECT COUNT(*) as total FROM recursos');
        const [admins] = await connection.query('SELECT COUNT(*) as total FROM administradores');

        console.log('5️⃣ Datos iniciales cargados:');
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
        console.log('   2. Prueba: http://localhost:3000/api/test/conexion');
        console.log('   3. Login admin: admin@vozsegura.com / Admin123!');
        console.log('');
        console.log('📚 Documentación:');
        console.log('   - INSTALACION.md - Guía de instalación');
        console.log('   - API-DOCS.md - Documentación de la API');
        console.log('   - README-MYSQL.md - Información completa');
        console.log('');

    } catch (error) {
        console.error('\n❌ Error durante la configuración:');
        console.error(error.message);
        console.log('\n🔧 Verifica:');
        console.log('   1. MySQL está corriendo');
        console.log('   2. Las credenciales en .env son correctas');
        console.log('   3. El usuario tiene permisos para crear bases de datos');
        console.log('\n💡 Intenta ejecutar manualmente:');
        console.log(`   mysql -u ${process.env.DB_USER || 'root'} -p < database/schema.sql`);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar setup
setupDatabase();
