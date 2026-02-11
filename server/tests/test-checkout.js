const http = require('http');

function testCheckout() {
    const saleData = {
        customerName: "Test Customer",
        items: [
            {
                id: 5,
                name: "27\" Monitor 4K",
                price: 25999.00,
                quantity: 1,
                lineTotal: 25999.00
            }
        ],
        subtotal: 25999.00,
        tax: 4679.82,
        grandTotal: 30678.82
    };

    const postData = JSON.stringify(saleData);

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/checkout',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('🧪 Testing Checkout Endpoint...\n');
    console.log('Sending data:', JSON.stringify(saleData, null, 2));
    console.log('\n---\n');

    const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log(`Status: ${res.statusCode}`);
            console.log('Response:', body);
            
            if (res.statusCode === 200) {
                console.log('\n✅ Checkout successful!');
            } else {
                console.log('\n❌ Checkout failed!');
                console.log('Check the server logs for detailed error.');
            }
        });
    });

    req.on('error', (error) => {
        console.log('❌ Connection failed:', error.message);
    });

    req.write(postData);
    req.end();
}

// Wait a moment for server to be ready, then test
setTimeout(testCheckout, 1000);
