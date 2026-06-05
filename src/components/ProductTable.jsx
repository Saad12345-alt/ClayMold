import React, { useState } from 'react';
import './ProductTable.css';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
    return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return ' ↕';
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const totalItems = products.reduce((s, p) => s + (p.totalnumberofitems || 0), 0);
  const totalValue = products.reduce((s, p) => s + (p.price * (p.stock || 0)), 0);

  return (
    <div className="product-table-container">
      {/* Top bar */}
      <div className="table-top-bar">
        <div className="search-wrapper">
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-label">Items Sold</div>
            <div className="stat-value">{totalItems}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Amount Sold</div>
            <div className="stat-value money">${totalValue.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      {sortedProducts.length > 0 ? (
        <div className="table-card">
          <table className="product-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable">Product Name{getSortIcon('name')}</th>
                <th onClick={() => handleSort('price')} className="sortable">Price{getSortIcon('price')}</th>
                <th onClick={() => handleSort('stock')} className="sortable text-center">Stock{getSortIcon('stock')}</th>
                <th className="text-center">Items</th>
                <th className="text-center">Image</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map(product => (
                <tr key={product._id}>
                  <td className="product-name">{product.name}</td>
                  <td className="product-price">${product.price.toFixed(2)}</td>
                  <td className="product-stock">
                    <span className={`stock-badges ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="text-center">{product.totalnumberofitems || '-'}</td>
                  <td className="text-center">
                    <div className="img-circle">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={e => { e.target.style.display = 'none'; e.target.parentNode.textContent = 'img'; }}
                        />
                      ) : 'img'}
                    </div>
                  </td>
                  <td className="actions">
                    <button className="btn-edit" onClick={() => onEdit(product)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => onDelete(product._id)} title="Delete">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-results">
          {searchTerm ? 'No products match your search.' : 'No products available.'}
        </div>
      )}
    </div>
  );
};

export default ProductTable;