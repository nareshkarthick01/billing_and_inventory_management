import React, { useState, useEffect } from 'react';
import axios from 'axios';
// PDF Imports
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BillingSystem = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [customerName, setCustomerName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Error loading products", err);
            }
        };
        fetchProducts();
    }, []);

    // --- PDF GENERATION FUNCTION ---
    const generatePDF = (invoiceId, cartItems, totals) => {
        const doc = new jsPDF();

        // 1. Add Business Header (Left Side) - JJ Electronics in BOLD
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(40);
        doc.text("JJ Electronics", 14, 20);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("Contact: +91 78457 78404", 14, 28);
        doc.text("GSTIN: 22AAAAA0000A1Z5", 14, 34);

        // INVOICE Title (Right Top Corner)
        doc.setFontSize(22);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(40);
        doc.text("INVOICE", 196, 20, { align: "right" });

        // 2. Add Invoice Details
        doc.setDrawColor(200);
        doc.line(14, 40, 196, 40); // Horizontal line
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Invoice Number: INV-${invoiceId}`, 14, 48);
        doc.text(`Customer: ${customerName}`, 14, 55);
        doc.text(`Date: ${new Date().toLocaleString()}`, 14, 62);

        // 3. Add Items Table
        const tableColumn = ["Product", "Unit Price", "Quantity", "Total"];
        const tableRows = cartItems.map(item => [
            item.name,
            `Rs. ${item.price.toFixed(2)}`,
            item.quantity,
            `Rs. ${item.lineTotal.toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 68,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80] } // Professional Dark Blue
        });

        // 4. Add Summary (Subtotal, Tax, Grand Total)
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.text(`Subtotal: Rs. ${totals.subtotal.toFixed(2)}`, 140, finalY);
        doc.text(`GST (18%): Rs. ${totals.tax.toFixed(2)}`, 140, finalY + 7);
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Grand Total: Rs. ${totals.grandTotal.toFixed(2)}`, 140, finalY + 15);

        // 5. Footer - Updated Message
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("Thank you for your purchase!", 105, finalY + 30, { align: "center" });

        // 6. Download File
        doc.save(`Invoice_${invoiceId}.pdf`);
    };

    const addToCart = () => {
        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) {
            alert("Please select a product first");
            return;
        }
        if (product.stock_quantity < quantity) {
            alert(`Insufficient Stock! Only ${product.stock_quantity} remaining.`);
            return;
        }

        const cartItem = {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: parseInt(quantity),
            lineTotal: parseFloat(product.price) * parseInt(quantity)
        };

        setCart([...cart, cartItem]);
        setSelectedProductId('');
        setQuantity(1);
    };

    const removeItem = (index) => {
        const newCart = cart.filter((_, i) => i !== index);
        setCart(newCart);
    };

    const subtotal = cart.reduce((acc, item) => acc + item.lineTotal, 0);
    const tax = subtotal * 0.18;
    const grandTotal = subtotal + tax;

    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert("Cart is empty!");
            return;
        }

        setIsProcessing(true);
        try {
            const saleData = {
                customerName,
                items: cart,
                subtotal,
                tax,
                grandTotal
            };

            console.log('📝 Sending checkout request:', saleData);
            const response = await axios.post('http://localhost:5000/api/checkout', saleData);
            console.log('✅ Checkout response:', response.data);

            if (response.data.success) {
                // TRIGGER PDF GENERATION
                try {
                    generatePDF(response.data.invoiceId, cart, { subtotal, tax, grandTotal });
                    alert(`Success! Invoice #${response.data.invoiceId} generated and downloaded.`);
                } catch (pdfError) {
                    console.error('PDF Generation Error:', pdfError);
                    alert(`Invoice #${response.data.invoiceId} created successfully, but PDF generation failed: ${pdfError.message}`);
                }
                
                setCart([]);
                setCustomerName('');
                window.location.reload();
            }
        } catch (error) {
            console.error('❌ Checkout Error Details:', error);
            console.error('Response:', error.response?.data);
            console.error('Status:', error.response?.status);
            console.error('Message:', error.message);
            
            const errorMessage = error.response?.data?.message || error.message || "Server Error";
            alert("Checkout Failed: " + errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <label>Customer Name: </label>
                <input 
                    type="text" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter here...."
                    style={styles.input}
                />
            </div>

            <div style={styles.selectionGrid}>
                <select 
                    value={selectedProductId} 
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    style={styles.select}
                >
                    <option value="">-- Choose Product --</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id} disabled={p.stock_quantity <= 0}>
                            {p.name} (Stock: {p.stock_quantity}) - ₹{p.price}
                        </option>
                    ))}
                </select>

                <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    style={styles.qtyInput}
                />

                <button onClick={addToCart} style={styles.addBtn}>Add to Cart</button>
            </div>

            <div style={styles.cartSection}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.tableHeader}>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={index} style={styles.tableRow}>
                                <td>{item.name}</td>
                                <td>₹{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.lineTotal.toFixed(2)}</td>
                                <td>
                                    <button onClick={() => removeItem(index)} style={styles.removeBtn}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={styles.summaryCard}>
                <div style={styles.summaryRow}><span>Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span></div>
                <div style={styles.summaryRow}><span>GST (18%):</span> <span>₹{tax.toFixed(2)}</span></div>
                <hr />
                <div style={styles.totalRow}><span>Grand Total:</span> <span>₹{grandTotal.toFixed(2)}</span></div>
                
                <button 
                    onClick={handleCheckout} 
                    style={isProcessing ? styles.disabledBtn : styles.checkoutBtn}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Complete Sale & Download Bill"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { marginBottom: '10px' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginLeft: '10px', width: '250px' },
    selectionGrid: { display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' },
    select: { flex: 2, padding: '10px', borderRadius: '4px' },
    qtyInput: { flex: 0.5, padding: '10px', borderRadius: '4px' },
    addBtn: { flex: 1, padding: '10px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    cartSection: { minHeight: '200px', border: '1px solid #edf2f7', borderRadius: '8px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeader: { textAlign: 'left', backgroundColor: '#edf2f7', color: '#4a5568' },
    tableRow: { borderBottom: '1px solid #edf2f7', height: '40px' },
    removeBtn: { color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' },
    summaryCard: { alignSelf: 'flex-end', width: '300px', padding: '20px', backgroundColor: '#2d3748', color: 'white', borderRadius: '12px' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' },
    checkoutBtn: { width: '100%', padding: '12px', backgroundColor: '#48bb78', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    disabledBtn: { width: '100%', padding: '12px', backgroundColor: '#a0aec0', color: 'white', border: 'none', borderRadius: '6px', cursor: 'not-allowed' }
};

export default BillingSystem;