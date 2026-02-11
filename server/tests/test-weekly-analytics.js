const axios = require('axios');

async function testWeeklyAnalytics() {
    try {
        console.log('📊 Testing Weekly Analytics Endpoint...\n');
        
        const response = await axios.get('http://localhost:5000/api/analytics');
        const data = response.data;
        
        console.log('✅ Analytics Retrieved Successfully!\n');
        
        console.log('📈 Current Week Stats:');
        console.log(`   Revenue: ₹${data.currentWeekRevenue}`);
        console.log(`   Invoices: ${data.currentWeekSales}`);
        
        console.log('\n📅 Weekly Revenue History:');
        if (data.weeklyRevenue && data.weeklyRevenue.length > 0) {
            data.weeklyRevenue.forEach(week => {
                console.log(`   ${week.week}: ₹${week.revenue} (${week.sales} sales)`);
            });
        } else {
            console.log('   No historical data yet');
        }
        
        console.log('\n🏆 Top Products:');
        if (data.topProducts && data.topProducts.length > 0) {
            data.topProducts.forEach((product, index) => {
                console.log(`   ${index + 1}. ${product.name}: ${product.quantity} units`);
            });
        } else {
            console.log('   No products sold yet');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
    }
}

testWeeklyAnalytics();
