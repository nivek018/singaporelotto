import mysql from 'mysql2/promise';

// Prevent multiple pool instances during hot reloading in development
const globalForDb = globalThis as unknown as {
    pool: mysql.Pool | undefined;
};

const pool = globalForDb.pool ?? mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sg_lotto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

if (process.env.NODE_ENV !== 'production') {
    globalForDb.pool = pool;
}

export default pool;
