import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = ({ refreshTrigger }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [refreshTrigger]);

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Are you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`)) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`);
            setDeleteMessage(`✅ "${productName}" has been deleted successfully.`);
            setTimeout(() => setDeleteMessage(''), 3000);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            const errorMsg = error.response?.data?.error || 'Failed to delete product.';
            setDeleteMessage(`❌ ${errorMsg}`);
            setTimeout(() => setDeleteMessage(''), 5000);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLowStock = showLowStockOnly 
            ? product.stock_quantity <= product.min_stock_level 
            : true;

        return matchesSearch && matchesLowStock;
    });

    if (loading) return <p>Loading inventory...</p>;

    return (
        <div style={styles.container}>
            {deleteMessage && (
                <div style={deleteMessage.includes('✅') ? styles.successAlert : styles.errorAlert}>
                    {deleteMessage}
                </div>
            )}

            <div style={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="🔍 Search name or SKU..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <label style={styles.checkboxLabel}>
                    <input 
                        type="checkbox" 
                        checked={showLowStockOnly}
                        onChange={(e) => setShowLowStockOnly(e.target.checked)}
                    />
                    Show Low Stock Only
                </label>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr style={styles.thRow}>
                        <th>SKU</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <tr key={product.id} style={styles.tr}>
                                <td style={styles.td}>{product.sku}</td>
                                <td style={styles.td}><strong>{product.name}</strong></td>
                                <td style={styles.td}>₹{product.price}</td>
                                <td style={styles.td}>{product.stock_quantity}</td>
                                <td style={styles.td}>
                                    {product.stock_quantity <= product.min_stock_level ? (
                                        <span style={styles.lowStockBadge}>Low Stock</span>
                                    ) : (
                                        <span style={styles.inStockBadge}>In Stock</span>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(product.id, product.name)}
                                        style={styles.deleteBtn}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#fee';
                                            e.target.style.color = '#c53030';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = 'transparent';
                                            e.target.style.color = '#e53e3e';
                                        }}
                                        title="Delete product"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                No products found matching your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: { marginTop: '10px' },
    filterBar: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        gap: '10px' 
    },
    searchInput: { 
        flex: 1, 
        padding: '10px', 
        borderRadius: '6px', 
        border: '1px solid #cbd5e0',
        fontSize: '14px'
    },
    checkboxLabel: { 
        fontSize: '14px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px',
        color: '#4a5568',
        cursor: 'pointer'
    },
    table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' },
    thRow: { backgroundColor: '#edf2f7', textAlign: 'left', borderBottom: '2px solid #cbd5e0' },
    tr: { borderBottom: '1px solid #edf2f7', transition: 'background 0.2s' },
    td: { padding: '12px', fontSize: '14px' },
    lowStockBadge: { 
        color: '#fff', 
        backgroundColor: '#e53e3e', 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '12px',
        fontWeight: '600'
    },
    inStockBadge: { 
        color: '#fff', 
        backgroundColor: '#38a169', 
        padding: '4px 8px', 
        borderRadius: '4px', 
        fontSize: '12px',
        fontWeight: '600'
    },
    deleteBtn: {
        padding: '2px 6px',
        backgroundColor: 'transparent',
        color: '#e53e3e',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '14px',
        marginLeft: '10px',
        transition: 'all 0.2s',
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    successAlert: {
        padding: '12px',
        backgroundColor: '#c6f6d5',
        color: '#22543d',
        borderRadius: '6px',
        marginBottom: '15px',
        border: '1px solid #9ae6b4',
        fontSize: '14px',
    },
    errorAlert: {
        padding: '10px 12px',
        backgroundColor: '#fff5f5',
        color: '#c53030',
        borderRadius: '6px',
        marginBottom: '15px',
        border: '1px solid #feb2b2',
        fontSize: '13px',
        lineHeight: '1.5',
    }
};

export default ProductList;