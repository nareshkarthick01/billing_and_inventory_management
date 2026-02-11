const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});


pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION ERROR:', err.message);
        console.error('Check your .env file credentials and ensure PostgreSQL is running.');
    } else {
        console.log('✅ Successfully connected to PostgreSQL database');
        release(); 
    }
});


app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM products ORDER BY name ASC");
        res.json(allProducts.rows);
    } catch (err) {
        console.error('❌ GET Products Error:', err.message);
        res.status(500).send("Server Error");
    }
});


app.post('/api/products', async (req, res) => {
    try {
        const { name, sku, price, stock_quantity, min_stock_level } = req.body;
        const newProduct = await pool.query(
            "INSERT INTO products (name, sku, price, stock_quantity, min_stock_level) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [name, sku, price, stock_quantity, min_stock_level]
        );
        res.json(newProduct.rows[0]);
    } catch (err) {
        console.error('❌ POST Product Error:', err.message);
        res.status(500).json({ error: "SKU must be unique or data is invalid" });
    }
});


app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { price, stock_quantity } = req.body;
        
        console.log(`📝 Updating product ${id}:`, { price, stock_quantity });
        
        if (price === undefined || stock_quantity === undefined) {
            return res.status(400).json({ error: "Price and stock_quantity are required" });
        }
        
        if (isNaN(price) || isNaN(stock_quantity)) {
            return res.status(400).json({ error: "Price and stock_quantity must be valid numbers" });
        }
        
        if (price < 0 || stock_quantity < 0) {
            return res.status(400).json({ error: "Price and stock_quantity cannot be negative" });
        }
        
        const updatedProduct = await pool.query(
            "UPDATE products SET price = $1, stock_quantity = $2 WHERE id = $3 RETURNING *",
            [price, stock_quantity, id]
        );
        
        if (updatedProduct.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        console.log('✅ Product updated successfully:', updatedProduct.rows[0].name);
        res.json(updatedProduct.rows[0]);
    } catch (err) {
        console.error('❌ PUT Product Error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: "Error updating product: " + err.message });
    }
});


app.delete('/api/products/:id', async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        
        console.log(`🗑️ Attempting to delete product ${id}`);
        
        await client.query('BEGIN'); 
        
        
        const checkProduct = await client.query(
            "SELECT * FROM products WHERE id = $1",
            [id]
        );
        
        if (checkProduct.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Product not found" });
        }
        
        const productName = checkProduct.rows[0].name;
        
        
        const invoiceCheck = await client.query(
            "SELECT COUNT(*) as count FROM invoice_items WHERE product_id = $1",
            [id]
        );
        
        const invoiceCount = parseInt(invoiceCheck.rows[0].count);
        if (invoiceCount > 0) {
            console.log(`⚠️ Warning: Product "${productName}" has been used in ${invoiceCount} invoice(s).`);
            console.log(`   Removing product references from invoice items...`);
            
          
            await client.query(
                "UPDATE invoice_items SET product_id = NULL WHERE product_id = $1",
                [id]
            );
        }
        
      
        await client.query("DELETE FROM products WHERE id = $1", [id]);
        
        await client.query('COMMIT');
        
        console.log(`✅ Product deleted successfully: ${productName}`);
        res.json({ success: true, message: `Product "${productName}" has been deleted` });
        
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ DELETE Product Error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: "Error deleting product: " + err.message });
    } finally {
        client.release();
    }
});



app.post('/api/checkout', async (req, res) => {
    const client = await pool.connect();
    try {
        const { customerName, items, subtotal, tax, grandTotal } = req.body;

        await client.query('BEGIN');

        
        const invoiceRes = await client.query(
            `INSERT INTO invoices (invoice_number, customer_name, subtotal, tax_amount, grand_total) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [`INV-${Date.now()}`, customerName, subtotal, tax, grandTotal]
        );
        const invoiceId = invoiceRes.rows[0].id;

      
        for (const item of items) {
          
            const updateStock = await client.query(
                'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2 AND stock_quantity >= $1 RETURNING name',
                [item.quantity, item.id]
            );

            if (updateStock.rowCount === 0) {
                throw new Error(`Insufficient stock for ${item.name}`);
            }

          
            await client.query(
                `INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, line_total) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [invoiceId, item.id, item.quantity, item.price, item.lineTotal]
            );
        }

        await client.query('COMMIT');
        console.log(`✅ Checkout Success: Invoice #${invoiceId} generated.`);
        res.json({ success: true, invoiceId });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Checkout Failed:', err.message);
        res.status(400).json({ success: false, message: err.message });
    } finally {
        client.release();
    }
});

app.get('/api/analytics', async (req, res) => {
    try {
       
        const currentWeekRevenue = await pool.query(
            `SELECT COALESCE(SUM(grand_total), 0) as revenue, COUNT(id) as total_sales 
             FROM invoices 
             WHERE sale_date >= date_trunc('week', CURRENT_TIMESTAMP)`
        );

      
        const weeklyRevenue = await pool.query(
            `SELECT 
                date_trunc('week', sale_date)::date as week_start,
                TO_CHAR(date_trunc('week', sale_date), 'Mon DD') as week_label,
                COALESCE(SUM(grand_total), 0) as revenue,
                COUNT(id) as sales_count
             FROM invoices
             WHERE sale_date >= CURRENT_TIMESTAMP - INTERVAL '8 weeks'
             GROUP BY date_trunc('week', sale_date)
             ORDER BY date_trunc('week', sale_date) ASC`
        );

        const topProducts = await pool.query(
            `SELECT p.name, SUM(ii.quantity) as quantity 
             FROM invoice_items ii 
             LEFT JOIN products p ON ii.product_id = p.id 
             WHERE p.name IS NOT NULL
             GROUP BY p.name 
             ORDER BY quantity DESC LIMIT 5`
        );

        res.json({
            currentWeekRevenue: parseFloat(currentWeekRevenue.rows[0].revenue || 0).toFixed(2),
            currentWeekSales: parseInt(currentWeekRevenue.rows[0].total_sales || 0),
            weeklyRevenue: weeklyRevenue.rows.map(row => ({
                week: row.week_label,
                revenue: parseFloat(row.revenue).toFixed(2),
                sales: parseInt(row.sales_count)
            })),
            topProducts: topProducts.rows
        });
    } catch (err) {
        console.error('❌ Analytics Error:', err.message);
        console.error('Stack:', err.stack);
        res.status(500).json({ error: err.message });
    }
});



app.get('/api/purchase-history', async (req, res) => {
    try {
        const limit = req.query.limit || 10; 
        
        const purchaseHistory = await pool.query(
            `SELECT 
                i.id,
                i.invoice_number,
                i.customer_name,
                i.grand_total,
                i.created_at as sale_date,
                COUNT(ii.id) as items_count
             FROM invoices i
             LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
             GROUP BY i.id, i.invoice_number, i.customer_name, i.grand_total, i.created_at
             ORDER BY i.created_at DESC
             LIMIT $1`,
            [limit]
        );

        res.json(purchaseHistory.rows);
    } catch (err) {
        console.error('❌ Purchase History Error:', err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});