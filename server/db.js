const { Pool } = require('pg');
require('dotenv').config();

/**
 * DATABASE CONNECTION CONFIGURATION
 * This pool manages multiple connections to the PostgreSQL database,
 * making your app faster and more stable under load.
 */
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the connection immediately on startup
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error acquiring client:', err.stack);
    }
    console.log('✅ Successfully connected to PostgreSQL database');
    release();
});

module.exports = pool;