import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { admin, logout, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [refreshTrigger]);

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const handleProductAdded = () => { setRefreshTrigger(p => p + 1); setActiveTab('list'); };
  const handleEditProduct = (product) => { setEditingProduct(product); setActiveTab('add'); };
  const handleCancelEdit = () => { setEditingProduct(null); setActiveTab('list'); };
  const handleProductUpdated = () => { setRefreshTrigger(p => p + 1); setEditingProduct(null); setActiveTab('list'); };
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/admin/products/${productId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete product');
        setRefreshTrigger(p => p + 1);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="header-right">
          <span className="welcome-msg">Welcome, {admin?.username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-brand">
            <h2>ClayShop</h2>
            <p>Management Portal</p>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'list' ? 'active' : ''}`}
              onClick={() => { setActiveTab('list'); setEditingProduct(null); }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              Products
            </button>
            <button
              className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
              onClick={() => { setActiveTab('add'); setEditingProduct(null); }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Product
            </button>
          </nav>

          <div className="sidebar-info">
            <p><strong>Total Products:</strong> {products.length}</p>
            <p>Status: <span className="status-badge">Active</span></p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {error && (
            <div className="error-alert">
              <span>{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="content-section">
              <div className="content-header">
                <h2>Product Catalog</h2>
                <p>Manage your inventory with tactile precision.</p>
              </div>
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="no-products">No products found. Start by adding one!</div>
              ) : (
                <ProductTable
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              )}
            </div>
          )}

          {activeTab === 'add' && (
            <div className="content-section">
              <div className="content-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <p>{editingProduct ? 'Update the product details below.' : 'Fill in the details to add a new product.'}</p>
              </div>
              <ProductForm
                product={editingProduct}
                onProductAdded={handleProductAdded}
                onProductUpdated={handleProductUpdated}
                onCancel={handleCancelEdit}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;