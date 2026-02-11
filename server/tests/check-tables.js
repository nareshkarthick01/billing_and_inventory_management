const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkTables() {
    try {
        console.log('Checking database tables...\n');
        
        // Check if tables exist
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        console.log('📋 Existing tables:');
        if (tablesResult.rows.length === 0) {
            console.log('❌ No tables found! You need to run schema.sql');
        } else {
            tablesResult.rows.forEach(row => {
                console.log(`  ✓ ${row.table_name}`);
            });
        }
        
        // Check products count
        const productsResult = await pool.query('SELECT COUNT(*) FROM products');
        console.log(`\n📦 Products in database: ${productsResult.rows[0].count}`);
        
        // Check invoices count
        const invoicesResult = await pool.query('SELECT COUNT(*) FROM invoices');
        console.log(`🧾 Invoices in database: ${invoicesResult.rows[0].count}`);
        
        console.log('\n✅ Database is ready!');
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('does not exist')) {
            console.log('\n⚠️  Tables do not exist. Please run the schema.sql file:');
            console.log('   psql -U postgres -d inventory_db -f schema.sql');
        }
    } finally {
        pool.end();
    }
}

checkTables();
