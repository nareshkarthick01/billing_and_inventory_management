import React, { useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ProductEditForm from './components/ProductEditForm';
import BillingSystem from './components/BillingSystem';
import Dashboard from './components/Dashboard';

function App() {
  const [view, setView] = useState('dashboard');
  const [refreshProducts, setRefreshProducts] = useState(0);

  const handleProductAdded = () => {
    setRefreshProducts(prev => prev + 1);
  };

  return (
    <div style={styles.appContainer}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span role="img" aria-label="electronics" style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>JJ Electronics</span>
        </div>
        <div style={styles.navLinks}>
          <button 
            style={view === 'dashboard' ? styles.activeBtn : styles.navBtn} 
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            style={view === 'inventory' ? styles.activeBtn : styles.navBtn} 
            onClick={() => setView('inventory')}
          >
            Inventory
          </button>
          <button 
            style={view === 'billing' ? styles.activeBtn : styles.navBtn} 
            onClick={() => setView('billing')}
          >
            Billing (POS)
          </button>
        </div>
      </nav>

      <main style={styles.mainContent}>
        
        {view === 'dashboard' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Business Overview</h2>
            <Dashboard />
          </div>
        )}

        {view === 'inventory' && (
          <div style={styles.inventoryLayout}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Add New Product</h2>
              <ProductForm onProductAdded={handleProductAdded} />
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Edit Product</h2>
              <ProductEditForm onProductUpdated={handleProductAdded} />
            </div>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Stock Management</h2>
              <ProductList key={refreshProducts} refreshTrigger={refreshProducts} />
            </div>
          </div>
        )}

        {view === 'billing' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🧾 Billing Terminal</h2>
            <p style={styles.subtitle}>Generate GST invoices and update stock automatically.</p>
            <BillingSystem />
          </div>
        )}

      </main>

      <footer style={styles.footer}>
        <p>© 2026 Inventory & Billing Management System | Built for Performance</p>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.8rem 2rem',
    backgroundColor: '#1a202c', 
    color: '#fff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  logo: {
    fontSize: '1.6rem',
    fontWeight: '700',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  logoIcon: {
    fontSize: '1.8rem',
    background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.5))',
  },
  logoText: {
    background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
  },
  navLinks: {
    display: 'flex',
    gap: '12px',
    marginLeft: 'auto',
  },
  navBtn: {
    padding: '10px 18px',
    backgroundColor: 'transparent',
    color: '#a0aec0',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  activeBtn: {
    padding: '10px 18px',
    backgroundColor: '#3182ce', 
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  inventoryLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 2fr', 
    gap: '1.5rem',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '1.25rem',
    color: '#2d3748',
    borderBottom: '2px solid #edf2f7',
    paddingBottom: '0.5rem',
  },
  subtitle: {
    color: '#718096',
    marginBottom: '1.5rem',
  },
  footer: {
    textAlign: 'center',
    padding: '1.5rem',
    color: '#718096',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #edf2f7',
  }
};

export default App; 