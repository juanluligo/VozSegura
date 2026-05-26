require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    console.log('Configurando base de datos VozSegura...\n');
    
    let connection;
    
    try {
        // Conectar a MySQL sin especificar base de datos
        console.log('1. Conectando a MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        console.log('Conectado a MySQL\n');

        // Leer el archivo SQL
        console.log('2. Leyendo archivo schema.sql...');
        const sqlPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('Archivo leido correctamente\n');

        // Ejecutar el script SQL
        console.log('3. Ejecutando script SQL...');
        console.log('(Esto puede tomar unos segundos)\n');
        await connection.query(sql);
        console.log('Base de datos creada exitosamente\n');

        // Verificar la creación
        console.log('4. Verificando instalacion...');
        await connection.query(`USE ${process.env.DB_NAME || 'vozsegura'}`);
        
        const [tables] = await connection.query('SHOW TABLES');
        console.log(`${tables.length} tablas creadas:`);
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`  ${tableName}`);
        });
        console.log('');

        // Contar datos iniciales
        const [instituciones] = await connection.query('SELECT COUNT(*) as total FROM instituciones');
        const [facultades] = await connection.query('SELECT COUNT(*) as total FROM facultades');
        const [recursos] = await connection.query('SELECT COUNT(*) as total FROM recursos');
        const [admins] = await connection.query('SELECT COUNT(*) as total FROM administradores');
        
        console.log('5. Datos iniciales cargados:');
        console.log(`  ${instituciones[0].total} instituciones`);
        console.log(`  ${facultades[0].total} facultades`);
        console.log(`  ${recursos[0].total} recursos de ayuda`);
        console.log(`  ${admins[0].total} administradores`);
        console.log('');

        console.log('BASE DE DATOS CONFIGURADA EXITOSAMENTE!');
        console.log('='.repeat(50));
        console.log('');
        console.log('Proximos pasos:');
        console.log('1. Ejecuta: npm start');
        console.log('2. Prueba: http://localhost:3000/api/test/conexion');
        console.log('3. Login admin: admin@vozsegura.com / Admin123!');
        console.log('');
        console.log('Documentacion:');
        console.log('- INSTALACION.md - Guia de instalacion');
        console.log('- API-DOCS.md - Documentacion de la API');
        console.log('- README-MYSQL.md - Informacion completa');
        console.log('');

    } catch (error) {
        console.error('\nError durante la configuracion:');
        console.error(error.message);
        console.log('\nVerifica:');
        console.log('1. MySQL esta corriendo');
        console.log('2. Las credenciales en .env son correctas');
        console.log('3. El usuario tiene permisos para crear bases de datos');
        console.log('\nIntenta ejecutar manualmente:');
        console.log(`mysql -u ${process.env.DB_USER || 'root'} -p < database/schema.sql`);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar setup
setupDatabase();

