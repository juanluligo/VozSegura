const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vozsegura';

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB conectado: ${conn.connection.host}`);
        console.log(`Base de datos: ${conn.connection.name}`);

        return conn;
    } catch (error) {
        console.error('Error al conectar MongoDB:', error.message);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB desconectado');
});

mongoose.connection.on('error', (err) => {
    console.error('Error de MongoDB:', err.message);
});

module.exports = { connectDB };
