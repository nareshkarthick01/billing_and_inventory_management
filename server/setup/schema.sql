-- ================================================
-- INVENTORY & BILLING MANAGEMENT SYSTEM
-- Database Schema
-- ================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- ================================================
-- 1. PRODUCTS TABLE
-- ================================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    min_stock_level INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 2. INVOICES TABLE
-- ================================================
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    grand_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- 3. INVOICE ITEMS TABLE (Line items for each invoice)
-- ================================================
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- INDEXES for better performance
-- ================================================
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_product ON invoice_items(product_id);

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================
INSERT INTO products (name, sku, price, stock_quantity, min_stock_level) VALUES
    ('Laptop Dell XPS 13', 'LAPTOP-001', 89999.00, 15, 5),
    ('Wireless Mouse Logitech', 'MOUSE-002', 1299.00, 50, 10),
    ('USB-C Hub 7-in-1', 'HUB-003', 2499.00, 30, 8),
    ('Mechanical Keyboard RGB', 'KB-004', 4599.00, 25, 5),
    ('27" Monitor 4K', 'MON-005', 25999.00, 10, 3),
    ('Webcam HD 1080p', 'CAM-006', 3499.00, 40, 10),
    ('Laptop Stand Aluminum', 'STAND-007', 1899.00, 35, 8),
    ('External SSD 1TB', 'SSD-008', 8999.00, 20, 5),
    ('Noise Cancelling Headphones', 'HEAD-009', 12999.00, 18, 5),
    ('Portable Charger 20000mAh', 'CHRG-010', 2999.00, 60, 15);

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
-- SELECT * FROM products;
-- SELECT * FROM invoices;
-- SELECT * FROM invoice_items;
