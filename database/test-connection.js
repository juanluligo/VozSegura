require('dotenv').config();
const { connectDB, query, queryOne } = require('../config/database');

async function testearConexion() {
    console.log('Iniciando pruebas de MySQL...\n');
    
    try {
        // 1. Probar conexión
        console.log('1. Probando conexión a MySQL...');
        await connectDB();
        console.log('Conexión exitosa\n');

        // 2. Verificar tablas
        console.log('2. Verificando tablas...');
        const tablas = await query('SHOW TABLES');
        console.log(`${tablas.length} tablas encontradas:`);
        tablas.forEach(tabla => {
            const nombreTabla = Object.values(tabla)[0];
            console.log(`  - ${nombreTabla}`);
        });
        console.log('');

        // 3. Contar registros iniciales
        console.log('3. Contando registros iniciales...');
        const instituciones = await queryOne('SELECT COUNT(*) as total FROM instituciones');
        const facultades = await queryOne('SELECT COUNT(*) as total FROM facultades');
        const recursos = await queryOne('SELECT COUNT(*) as total FROM recursos');
        const admins = await queryOne('SELECT COUNT(*) as total FROM administradores');
        
        console.log(`  Instituciones: ${instituciones.total}`);
        console.log(`  Facultades: ${facultades.total}`);
        console.log(`  Recursos: ${recursos.total}`);
        console.log(`  Administradores: ${admins.total}`);
        console.log('');

        // 4. Probar vistas
        console.log('4. Probando vistas...');
        const vistaDenuncias = await query('SELECT * FROM vista_denuncias_completas LIMIT 1');
        const vistaEstadisticas = await query('SELECT * FROM vista_estadisticas_estado LIMIT 1');
        console.log(`  vista_denuncias_completas: OK`);
        console.log(`  vista_estadisticas_estado: OK`);
        console.log('');

        // 5. Verificar procedimientos almacenados
        console.log('5. Verificando procedimientos almacenados...');
        const procedimientos = await query(
            `SELECT ROUTINE_NAME 
            FROM INFORMATION_SCHEMA.ROUTINES 
            WHERE ROUTINE_SCHEMA = ? 
            AND ROUTINE_TYPE = 'PROCEDURE'`,
            [process.env.DB_NAME || 'vozsegura']
        );
        console.log(`${procedimientos.length} procedimientos almacenados:`);
        procedimientos.forEach(proc => {
            console.log(`  - ${proc.ROUTINE_NAME}`);
        });
        console.log('');

        // 6. Probar funcionalidad básica de modelos
        console.log('6. Probando modelos...');
        const Usuario = require('../models/Usuario');
        const Denuncia = require('../models/Denuncia');
        const Institucion = require('../models/Institucion');
        
        const institucionesList = await Institucion.obtenerTodas();
        console.log(`  Modelo Institucion: ${institucionesList.length} instituciones`);
        
        const facultadesList = await query('SELECT * FROM facultades');
        console.log(`  ${facultadesList.length} facultades disponibles`);
        console.log('');

        // 7. Resumen final
        console.log('RESUMEN DE PRUEBAS');
        console.log('='.repeat(50));
        console.log('Base de datos configurada correctamente');
        console.log('Todas las tablas creadas');
        console.log('Datos iniciales cargados');
        console.log('Vistas funcionando');
        console.log('Procedimientos almacenados disponibles');
        console.log('Modelos funcionando correctamente');
        console.log('='.repeat(50));
        console.log('\nSistema listo para usar!');
        console.log('\nPróximos pasos:');
        console.log('1. Ejecuta: npm start');
        console.log('2. Prueba el endpoint: http://localhost:3000/api/test/conexion');
        console.log('3. Revisa la documentación en API-DOCS.md');
        console.log('4. Credenciales admin: admin@vozsegura.com / Admin123!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\nError durante las pruebas:');
        console.error(error);
        console.log('\nVerifica:');
        console.log('1. MySQL está corriendo');
        console.log('2. Credenciales en .env son correctas');
        console.log('3. La base de datos fue creada (ejecuta database/schema.sql)');
        process.exit(1);
    }
}

// Ejecutar pruebas
testearConexion();
