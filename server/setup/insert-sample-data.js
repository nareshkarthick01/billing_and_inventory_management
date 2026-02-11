const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function insertSampleData() {
    try {
        console.log('Adding sample products...\n');
        
        const products = [
            ['Laptop Dell XPS 13', 'LAPTOP-001', 89999.00, 15, 5],
            ['Wireless Mouse Logitech', 'MOUSE-002', 1299.00, 50, 10],
            ['USB-C Hub 7-in-1', 'HUB-003', 2499.00, 30, 8],
            ['Mechanical Keyboard RGB', 'KB-004', 4599.00, 25, 5],
            ['27" Monitor 4K', 'MON-005', 25999.00, 10, 3],
            ['Webcam HD 1080p', 'CAM-006', 3499.00, 40, 10],
            ['Laptop Stand Aluminum', 'STAND-007', 1899.00, 35, 8],
            ['External SSD 1TB', 'SSD-008', 8999.00, 20, 5],
            ['Noise Cancelling Headphones', 'HEAD-009', 12999.00, 18, 5],
            ['Portable Charger 20000mAh', 'CHRG-010', 2999.00, 60, 15]
        ];

        for (const [name, sku, price, stock, minStock] of products) {
            await pool.query(
                'INSERT INTO products (name, sku, price, stock_quantity, min_stock_level) VALUES ($1, $2, $3, $4, $5)',
                [name, sku, price, stock, minStock]
            );
            console.log(`✓ Added: ${name}`);
        }

        console.log('\n✅ All sample products added successfully!');
        
        // Verify
        const result = await pool.query('SELECT COUNT(*) FROM products');
        console.log(`📦 Total products in database: ${result.rows[0].count}`);
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('duplicate key')) {
            console.log('\n⚠️  Products already exist in the database.');
        }
    } finally {
        pool.end();
    }
}

insertSampleData();
