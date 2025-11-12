const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function crearAdmin() {
  try {
    const email = 'admin@vozsegura.com';
    const password = 'admin123';
    const nombre = 'Administrador VozSegura';

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar admin
    const query = `
      INSERT INTO usuarios (nombre, email, password, rol, telefono)
      VALUES (?, ?, ?, 'admin', '0000000000')
      ON DUPLICATE KEY UPDATE
      password = ?, rol = 'admin'
    `;

    await db.query(query, [nombre, email, hashedPassword, hashedPassword]);

    console.log('✅ Administrador creado exitosamente');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n🎯 Ahora puedes iniciar sesión y acceder al Dashboard');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearAdmin();
