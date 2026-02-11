import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';

const Dashboard = () => {
    const [data, setData] = useState({ 
        currentWeekRevenue: 0, 
        currentWeekSales: 0, 
        weeklyRevenue: [],
        topProducts: [] 
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/analytics').then(res => setData(res.data));
    }, []);

    return (
        <div style={{ padding: '10px' }}>
            {/* Current Week Stats */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#4a5568', fontSize: '16px' }}>This Week's Revenue</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#2d3748' }}>
                        ₹{data.currentWeekRevenue}
                    </p>
                </div>
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#4a5568', fontSize: '16px' }}>This Week's Invoices</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0', color: '#2d3748' }}>
                        {data.currentWeekSales}
                    </p>
                </div>
            </div>

            {/* Weekly Revenue Chart */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: '0', color: '#2d3748' }}>Weekly Revenue Trend (Last 8 Weeks)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.weeklyRevenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip 
                            formatter={(value, name) => {
                                if (name === 'revenue') return ['₹' + value, 'Revenue'];
                                return [value, 'Sales'];
                            }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3182ce" strokeWidth={2} name="Revenue (₹)" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Selling Products Chart */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: '0', color: '#2d3748' }}>Top Selling Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="quantity" fill="#3182ce" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const cardStyle = { 
    flex: 1, 
    padding: '20px', 
    backgroundColor: '#fff', 
    borderRadius: '8px', 
    textAlign: 'center', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
};

export default Dashboard;