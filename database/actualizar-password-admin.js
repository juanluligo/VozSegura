const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function actualizarPasswordAdmin() {
  try {
    const email = 'admin@vozsegura.com';
    const password = 'admin123';

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Hash generado:', hashedPassword);

    // Actualizar en la base de datos
    const query = 'UPDATE usuarios SET password = ? WHERE email = ?';
    await db.query(query, [hashedPassword, email]);

    console.log('Contraseña actualizada exitosamente');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\nAhora puedes hacer login con estas credenciales');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

actualizarPasswordAdmin();
