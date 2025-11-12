require('dotenv').config();
const db = require('../config/database');

async function verificarAdmin() {
    try {
        console.log('🔍 Verificando usuario admin en la base de datos...\n');
        
        const usuarios = await db.query(
            'SELECT id, nombre, email, rol, activo, fecha_registro FROM usuarios WHERE email = ?',
            ['admin@vozsegura.com']
        );
        
        console.log('Resultado query:', usuarios);
        
        if (!usuarios || usuarios.length === 0) {
            console.log('❌ No se encontró el usuario admin@vozsegura.com');
            process.exit(1);
        }
        
        const admin = usuarios[0];
        
        console.log('\n✅ Usuario admin encontrado:');
        console.log(JSON.stringify(admin, null, 2));
        console.log('\n📋 Detalles:');
        console.log(`   ID: ${admin.id}`);
        console.log(`   Nombre: ${admin.nombre}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Rol: ${admin.rol || 'NO TIENE ROL'}`);
        console.log(`   Activo: ${admin.activo ? 'Sí' : 'No'}`);
        console.log(`   Fecha registro: ${admin.fecha_registro}`);
        
        if (!admin.rol || admin.rol !== 'admin') {
            console.log('\n⚠️  PROBLEMA DETECTADO: El usuario no tiene rol "admin"');
            console.log('   Ejecuta este comando en MySQL:');
            console.log('   UPDATE usuarios SET rol = "admin" WHERE email = "admin@vozsegura.com";');
        } else {
            console.log('\n✅ Todo correcto! El usuario tiene rol "admin"');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verificarAdmin();
