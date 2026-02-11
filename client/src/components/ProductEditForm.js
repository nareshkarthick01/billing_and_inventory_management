import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductEditForm = ({ onProductUpdated }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        price: '',
        stockToAdd: 0
    });
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleProductSelect = (e) => {
        const productId = parseInt(e.target.value);
        const product = products.find(p => p.id === productId);
        
        if (product) {
            setSelectedProduct(product);
            setFormData({
                price: product.price,
                stockToAdd: 0
            });
            setMessage('');
        } else {
            setSelectedProduct(null);
            setFormData({ price: '', stockToAdd: 0 });
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedProduct) {
            setMessage('❌ Please select a product first.');
            return;
        }

        try {
            const priceValue = parseFloat(formData.price);
            const stockToAddValue = parseInt(formData.stockToAdd || 0);
            const newStockQuantity = selectedProduct.stock_quantity + stockToAddValue;

            if (isNaN(priceValue) || priceValue < 0) {
                setMessage('❌ Please enter a valid price.');
                return;
            }

            if (newStockQuantity < 0) {
                setMessage('❌ Stock quantity cannot be negative.');
                return;
            }

            const updateData = {
                price: priceValue,
                stock_quantity: newStockQuantity
            };

            console.log('Sending update:', updateData);
            const response = await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, updateData);
            console.log('Update response:', response.data);
            
            setMessage(`✅ Success! ${selectedProduct.name} has been updated.`);
            
            setSelectedProduct(null);
            setFormData({ price: '', stockToAdd: 0 });
            setSearchTerm('');
            
            fetchProducts();
            
            if (onProductUpdated) {
                onProductUpdated();
            }
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Error details:', error.response?.data);
            const errorMsg = error.response?.data?.error || 'Please try again.';
            setMessage(`❌ Error updating product: ${errorMsg}`);
        }
    };

    return (
        <div style={styles.container}>
            {message && (
                <div style={message.includes('✅') ? styles.successAlert : styles.errorAlert}>
                    {message}
                </div>
            )}

            {/* Product Selection */}
            <div style={styles.formGroup}>
                <label style={styles.label}>Search & Select Product</label>
                <input
                    type="text"
                    placeholder="🔍 Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <select
                    onChange={handleProductSelect}
                    value={selectedProduct?.id || ''}
                    style={styles.select}
                >
                    <option value="">-- Select a Product --</option>
                    {filteredProducts.map(product => (
                        <option key={product.id} value={product.id}>
                            {product.name} ({product.sku}) - Current Stock: {product.stock_quantity}
                        </option>
                    ))}
                </select>
            </div>

            {/* Show form only when product is selected */}
            {selectedProduct && (
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.infoBox}>
                        <h3 style={styles.infoTitle}>Current Product Details</h3>
                        <div style={styles.infoGrid}>
                            <div>
                                <strong>Product:</strong> {selectedProduct.name}
                            </div>
                            <div>
                                <strong>SKU:</strong> {selectedProduct.sku}
                            </div>
                            <div>
                                <strong>Current Price:</strong> ₹{selectedProduct.price}
                            </div>
                            <div>
                                <strong>Current Stock:</strong> {selectedProduct.stock_quantity} units
                            </div>
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Update Price (₹)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="Enter new price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Add Stock Quantity</label>
                        <input
                            name="stockToAdd"
                            type="number"
                            placeholder="Enter quantity to add (use negative to reduce)"
                            value={formData.stockToAdd}
                            onChange={handleChange}
                            style={styles.input}
                        />
                        <small style={styles.helpText}>
                            New Stock: {selectedProduct.stock_quantity + parseInt(formData.stockToAdd || 0)} units
                        </small>
                    </div>

                    <button type="submit" style={styles.button}>
                        💾 Update Product
                    </button>
                </form>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '10px',
    },
    formGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#2d3748',
        fontSize: '14px',
    },
    searchInput: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #cbd5e0',
        fontSize: '14px',
        marginBottom: '10px',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #cbd5e0',
        fontSize: '14px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxSizing: 'border-box',
    },
    form: {
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '2px solid #edf2f7',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #cbd5e0',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3182ce',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'background 0.2s',
        marginTop: '10px',
    },
    infoBox: {
        backgroundColor: '#f7fafc',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e2e8f0',
    },
    infoTitle: {
        margin: '0 0 12px 0',
        fontSize: '14px',
        color: '#4a5568',
        fontWeight: '600',
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        fontSize: '13px',
        color: '#2d3748',
    },
    helpText: {
        display: 'block',
        marginTop: '5px',
        color: '#718096',
        fontSize: '12px',
    },
    successAlert: {
        padding: '12px',
        backgroundColor: '#c6f6d5',
        color: '#22543d',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #9ae6b4',
    },
    errorAlert: {
        padding: '12px',
        backgroundColor: '#fed7d7',
        color: '#742a2a',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #fc8181',
    },
};

export default ProductEditForm;
