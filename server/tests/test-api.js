const http = require('http');

function testAPI(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: endpoint,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                console.log(`\n📡 ${method} ${endpoint}`);
                console.log(`Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    console.log('✅ Success!');
                    const parsed = JSON.parse(body);
                    console.log('Response:', JSON.stringify(parsed, null, 2).substring(0, 500));
                } else {
                    console.log('❌ Error!');
                    console.log('Response:', body);
                }
                resolve();
            });
        });

        req.on('error', (error) => {
            console.log(`❌ ${method} ${endpoint} - Connection failed`);
            console.log('Error:', error.message);
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing API Endpoints...\n');
    
    try {
        await testAPI('/api/products');
        await testAPI('/api/analytics');
        
        console.log('\n✅ All tests completed!');
    } catch (err) {
        console.log('\n⚠️  Some tests failed. Check if server is running.');
    }
}

runTests();
