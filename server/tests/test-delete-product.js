const axios = require('axios');

async function testDeleteProduct() {
    try {
        // First, create a test product to delete
        console.log('1️⃣ Creating a test product...');
        const createResponse = await axios.post('http://localhost:5000/api/products', {
            name: 'Test Product for Deletion',
            sku: `TEST-DELETE-${Date.now()}`,
            price: 99.99,
            stock_quantity: 5,
            min_stock_level: 2
        });
        
        const testProduct = createResponse.data;
        console.log(`✅ Test product created: ${testProduct.name} (ID: ${testProduct.id})`);
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Now delete it
        console.log(`\n2️⃣ Deleting product ID ${testProduct.id}...`);
        const deleteResponse = await axios.delete(`http://localhost:5000/api/products/${testProduct.id}`);
        
        console.log('✅ Delete successful!');
        console.log('   Response:', deleteResponse.data);
        
        // Verify it's deleted
        console.log('\n3️⃣ Verifying deletion...');
        try {
            await axios.get(`http://localhost:5000/api/products/${testProduct.id}`);
            console.log('❌ Product still exists (this shouldn\'t happen)');
        } catch (err) {
            console.log('✅ Product successfully removed from database');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response data:', error.response.data);
            console.error('   Status code:', error.response.status);
        }
    }
}

testDeleteProduct();
