const axios = require('axios');

async function testUpdateProduct() {
    try {
        // First, get all products to find one to update
        console.log('1️⃣ Fetching products...');
        const productsResponse = await axios.get('http://localhost:5000/api/products');
        const products = productsResponse.data;
        
        if (products.length === 0) {
            console.log('❌ No products found to update');
            return;
        }
        
        const testProduct = products[0];
        console.log(`2️⃣ Selected product: ${testProduct.name} (ID: ${testProduct.id})`);
        console.log(`   Current - Price: ₹${testProduct.price}, Stock: ${testProduct.stock_quantity}`);
        
        // Update the product
        const newPrice = parseFloat(testProduct.price) + 100;
        const newStock = testProduct.stock_quantity + 10;
        
        console.log(`3️⃣ Updating product with - Price: ₹${newPrice}, Stock: ${newStock}`);
        
        const updateResponse = await axios.put(
            `http://localhost:5000/api/products/${testProduct.id}`,
            {
                price: newPrice,
                stock_quantity: newStock
            }
        );
        
        console.log('✅ Update successful!');
        console.log('   Updated product:', updateResponse.data);
        console.log(`   New - Price: ₹${updateResponse.data.price}, Stock: ${updateResponse.data.stock_quantity}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response data:', error.response.data);
            console.error('   Status code:', error.response.status);
        }
    }
}

testUpdateProduct();
