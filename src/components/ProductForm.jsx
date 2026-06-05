import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onProductAdded, onProductUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    id: '', name: '', image: '', price: '', stock: '', totalnumberofitems: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id || '',
        name: product.name || '',
        image: product.image || '',
        price: product.price || '',
        stock: product.stock || '',
        totalnumberofitems: product.totalnumberofitems || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setError('Product name is required'); return false; }
    if (!formData.price || formData.price <= 0) { setError('Valid price is required'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const url = product
        ? `http://localhost:5000/admin/products/${product._id}`
        : 'http://localhost:5000/admin/products';
      const method = product ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: formData.id || undefined,
          name: formData.name,
          image: formData.image,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          totalnumberofitems: parseInt(formData.totalnumberofitems) || 0
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save product');

      setSuccess(product ? 'Product updated successfully!' : 'Product added successfully!');

      if (product) {
        onProductUpdated?.();
      } else {
        setFormData({ id: '', name: '', image: '', price: '', stock: '', totalnumberofitems: '' });
        onProductAdded?.();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-card">
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {/* Product Name */}
        <div className="pf-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text" id="name" name="name"
            value={formData.name} onChange={handleChange}
            placeholder="Enter product name"
            disabled={loading} required
          />
        </div>

        {/* Price / Stock / Total Items row */}
        <div className="pf-row-3">
          <div className="pf-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number" id="price" name="price"
              value={formData.price} onChange={handleChange}
              placeholder="Enter price"
              step="0.01" min="0" disabled={loading} required
            />
          </div>
          <div className="pf-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number" id="stock" name="stock"
              value={formData.stock} onChange={handleChange}
              placeholder="Enter stock"
              min="0" disabled={loading}
            />
          </div>
          <div className="pf-group">
            <label htmlFor="totalnumberofitems">Total Items</label>
            <input
              type="number" id="totalnumberofitems" name="totalnumberofitems"
              value={formData.totalnumberofitems} onChange={handleChange}
              placeholder="Enter total"
              min="0" disabled={loading}
            />
          </div>
        </div>

        {/* Product ID */}
        <div className="pf-group">
          <label htmlFor="id">Product ID</label>
          <input
            type="text" id="id" name="id"
            value={formData.id} onChange={handleChange}
            placeholder="Enter product ID (optional)"
            disabled={loading}
          />
        </div>

        {/* Image – upload zone + URL fallback */}
        <div className="pf-group">
          <label>Product Image</label>
          <div className="upload-zone">
            <input type="file" accept="image/png,image/jpeg,image/webp" disabled={loading} />
            <div className="upload-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
            </div>
            <p className="upload-title">Click to upload or drag and drop</p>
            <p className="upload-hint">PNG, JPG or WEBP (Max. 5MB)</p>
          </div>

          <div className="url-input-wrap">
            <input
              type="url" name="image"
              value={formData.image} onChange={handleChange}
              placeholder="Or paste image URL"
              disabled={loading}
            />
          </div>
        </div>

        {formData.image && (
          <div className="image-preview">
            <img src={formData.image} alt="Preview"
              onError={e => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'; }} />
          </div>
        )}

        <button type="submit" className="btn-submit" disabled={loading}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
        </button>

        {product && (
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default ProductForm;