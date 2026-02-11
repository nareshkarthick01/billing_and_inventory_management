const axios = require('axios');

async function testCheckoutFromFrontend() {
    console.log('🧪 Testing checkout exactly as frontend would send it...\n');
    
    // First, get products to simulate real scenario
    try {
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        console.log(`✅ Got ${productsResponse.data.length} products from API\n`);
        
        // Take first product
        const product = productsResponse.data[0];
        console.log('Using product:', product.name);
        console.log('Product ID:', product.id);
        console.log('Product price:', product.price);
        console.log('Product stock:', product.stock_quantity);
        console.log('');
        
        // Create cart exactly like frontend does
        const cart = [{
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            quantity: 1,
            lineTotal: parseFloat(product.price) * 1
        }];
        
        const subtotal = cart.reduce((acc, item) => acc + item.lineTotal, 0);
        const tax = subtotal * 0.18;
        const grandTotal = subtotal + tax;
        
        const saleData = {
            customerName: 'Test Customer Frontend',
            items: cart,
            subtotal,
            tax,
            grandTotal
        };
        
        console.log('Sending checkout data:');
        console.log(JSON.stringify(saleData, null, 2));
        console.log('\n---\n');
        
        const response = await axios.post('http://localhost:5000/api/checkout', saleData);
        
        console.log('✅ Response:', response.data);
        console.log('\n✅ CHECKOUT SUCCESSFUL!');
        
    } catch (error) {
        console.error('❌ CHECKOUT FAILED!');
        console.error('Status:', error.response?.status);
        console.error('Error Message:', error.response?.data?.message || error.message);
        console.error('Full Response:', error.response?.data);
        console.error('\nStack:', error.stack);
    }
}

testCheckoutFromFrontend();
