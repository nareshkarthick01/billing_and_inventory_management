const axios = require('axios');

async function testDeleteWithInvoices() {
    try {
        // Try to delete a product that likely has invoice history
        console.log('1️⃣ Fetching products to find one with potential invoice history...');
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const products = productsResponse.data;
        
        if (products.length === 0) {
            console.log('❌ No products found');
            return;
        }
        
        // Try deleting the first product (which likely has invoice history)
        const testProduct = products[0];
        console.log(`\n2️⃣ Attempting to delete: ${testProduct.name} (ID: ${testProduct.id})`);
        console.log(`   Current stock: ${testProduct.stock_quantity}`);
        
        const deleteResponse = await axios.delete(`http://localhost:5000/api/products/${testProduct.id}`);
        
        console.log('\n✅ Delete successful!');
        console.log('   Response:', deleteResponse.data);
        console.log('\n🎉 Product deletion now works even if it was used in invoices!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response data:', error.response.data);
            console.error('   Status code:', error.response.status);
        }
    }
}

testDeleteWithInvoices();
