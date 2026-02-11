const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkStock() {
    try {
        console.log('📦 Current Product Stock Levels:\n');
        
        const result = await pool.query(`
            SELECT 
                id,
                name,
                sku,
                price,
                stock_quantity,
                min_stock_level,
                CASE 
                    WHEN stock_quantity = 0 THEN '❌ OUT OF STOCK'
                    WHEN stock_quantity < min_stock_level THEN '⚠️  LOW STOCK'
                    ELSE '✅ IN STOCK'
                END as status
            FROM products
            ORDER BY name ASC
        `);
        
        console.table(result.rows.map(r => ({
            ID: r.id,
            Name: r.name,
            SKU: r.sku,
            Price: `Rs. ${r.price}`,
            Stock: r.stock_quantity,
            MinLevel: r.min_stock_level,
            Status: r.status
        })));
        
        const outOfStock = result.rows.filter(r => r.stock_quantity === 0);
        const lowStock = result.rows.filter(r => r.stock_quantity > 0 && r.stock_quantity < r.min_stock_level);
        
        console.log('\n📊 Summary:');
        console.log(`   Total Products: ${result.rows.length}`);
        console.log(`   Out of Stock: ${outOfStock.length}`);
        console.log(`   Low Stock: ${lowStock.length}`);
        
        if (outOfStock.length > 0) {
            console.log('\n❌ OUT OF STOCK PRODUCTS:');
            outOfStock.forEach(p => console.log(`   - ${p.name} (${p.sku})`));
        }
        
        if (lowStock.length > 0) {
            console.log('\n⚠️  LOW STOCK WARNINGS:');
            lowStock.forEach(p => console.log(`   - ${p.name}: ${p.stock_quantity} remaining (min: ${p.min_stock_level})`));
        }
        
    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        pool.end();
    }
}

checkStock();
