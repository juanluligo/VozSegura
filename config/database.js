const mysql = require('mysql2/promise');

// Pool de conexiones
let pool = null;

const createPool = () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'vozsegura',
            port: process.env.DB_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        });
    }
    return pool;
};

const connectDB = async () => {
    try {
        pool = createPool();
        
        // Verificar conexión
        const connection = await pool.getConnection();
        console.log('✅ MySQL conectado exitosamente');
        console.log(`📊 Base de datos: ${process.env.DB_NAME || 'vozsegura'}`);
        connection.release();
        
        return pool;
    } catch (error) {
        console.error('❌ Error al conectar MySQL:', error.message);
        process.exit(1);
    }
};

const getPool = () => {
    if (!pool) {
        return createPool();
    }
    return pool;
};

const query = async (sql, params) => {
    try {
        const pool = getPool();
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Error en query:', error);
        throw error;
    }
};

const queryOne = async (sql, params) => {
    const results = await query(sql, params);
    return results[0] || null;
};

module.exports = {
    connectDB,
    getPool,
    query,
    queryOne
};
