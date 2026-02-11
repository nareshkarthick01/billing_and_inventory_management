const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function modifySchema() {
    try {
        console.log('🔧 Modifying database schema to allow product deletion...');
        
        // Allow NULL values in product_id to handle deleted products
        await pool.query('ALTER TABLE invoice_items ALTER COLUMN product_id DROP NOT NULL');
        
        console.log('✅ Schema modified successfully!');
        console.log('   invoice_items.product_id can now be NULL');
        console.log('   This allows products to be deleted even if they appear in old invoices.');
        
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
}

modifySchema();
