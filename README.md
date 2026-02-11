# JJ Electronics - Inventory & Billing System

A modern, full-stack inventory management and billing system built with React and Node.js.

## 📁 Project Structure

```
Inventory-app/
├── client/                 # React Frontend
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/     # React Components
│   │   │   ├── BillingSystem.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ProductEditForm.js
│   │   │   ├── ProductForm.js
│   │   │   └── ProductList.js
│   │   ├── App.css
│   │   ├── App.js         # Main App Component
│   │   ├── index.css
│   │   └── index.js       # Entry Point
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── setup/              # Database Setup Files
    │   ├── DATABASE_SETUP.md
    │   ├── schema.sql
    │   ├── insert-sample-data.js
    │   └── modify-schema.js
    ├── tests/              # Test Files
    │   ├── test-api.js
    │   ├── test-checkout.js
    │   ├── test-db.js
    │   ├── test-delete-product.js
    │   ├── test-delete-with-invoices.js
    │   ├── test-frontend-checkout.js
    │   ├── test-update-product.js
    │   ├── test-weekly-analytics.js
    │   ├── check-schema.js
    │   ├── check-stock.js
    │   └── check-tables.js
    ├── .env               # Environment Variables
    ├── db.js              # Database Connection
    ├── server.js          # Main Server File
    └── package.json
```

## 🚀 Features

- **Dashboard**: Weekly revenue tracking and analytics
- **Inventory Management**: Add, edit, update stock, and delete products
- **Billing System**: POS system with GST invoice generation
- **Weekly Analytics**: Visual revenue trends and top products

## 💻 Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Inventory-app
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Database**
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` and update credentials
   - Run the schema: `node setup/insert-sample-data.js`

4. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start Backend** (in server folder)
   ```bash
   npm start
   # Runs on http://localhost:5000
   ```

2. **Start Frontend** (in client folder)
   ```bash
   npm start
   # Runs on http://localhost:3000
   ```

## 🔧 API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/checkout` - Process billing/checkout
- `GET /api/analytics` - Get weekly analytics
- `GET /api/purchase-history` - Get recent invoices

## 📊 Database Schema

- **products**: Product inventory
- **invoices**: Sales invoices
- **invoice_items**: Invoice line items

## 🧪 Testing

Test files are located in `server/tests/`:
```bash
cd server
node tests/test-api.js
node tests/test-checkout.js
```

## 🎨 Tech Stack

**Frontend:**
- React 18
- Axios
- Recharts (for data visualization)

**Backend:**
- Node.js
- Express
- PostgreSQL
- pg (node-postgres)

## 📝 License

Private Project - All rights reserved

## 👨‍💻 Developer

JJ Electronics Development Team

---

**Version:** 1.0.0  
**Last Updated:** February 2026
