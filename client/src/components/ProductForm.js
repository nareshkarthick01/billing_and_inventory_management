import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onProductAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock_quantity: '',
        min_stock_level: 5
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/products', formData);
            setMessage(`Success! ${response.data.name} added to inventory.`);
            setFormData({ name: '', sku: '', price: '', stock_quantity: '', min_stock_level: 5 });
            
            if (onProductAdded) {
                onProductAdded();
            }
        } catch (error) {
            setMessage('Error adding product. Check if SKU is unique.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Add New Product</h2>
            {message && <p style={styles.alert}>{message}</p>}
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required style={styles.input} />
                <input name="sku" placeholder="SKU (e.g., PROD-101)" value={formData.sku} onChange={handleChange} required style={styles.input} />
                <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required style={styles.input} />
                <input name="stock_quantity" type="number" placeholder="Initial Stock" value={formData.stock_quantity} onChange={handleChange} required style={styles.input} />
                <label>Low Stock Alert Level:</label>
                <input name="min_stock_level" type="number" value={formData.min_stock_level} onChange={handleChange} style={styles.input} />
                
                <button type="submit" style={styles.button}>Add to Inventory</button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
    button: { padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    alert: { color: 'green', fontWeight: 'bold' }
};

export default ProductForm;