import React, { useState } from 'react';
import './OrdersTable.css';

const STATUSES = ['pending', 'confirmed', 'delivered', 'cancelled'];
const FILTERS = ['all', ...STATUSES];

const formatDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

const OrdersTable = ({ orders, summary, onStatusChange }) => {
  const [filter, setFilter] = useState('all');

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="orders-container">
      {/* Summary cards */}
      <div className="orders-stats">
        <div className="orders-stat">
          <div className="orders-stat-label">Orders</div>
          <div className="orders-stat-value">{summary.orders}</div>
        </div>
        <div className="orders-stat">
          <div className="orders-stat-label">Pending</div>
          <div className="orders-stat-value">{summary.pending}</div>
        </div>
        <div className="orders-stat">
          <div className="orders-stat-label">Items Sold</div>
          <div className="orders-stat-value">{summary.itemsSold}</div>
        </div>
        <div className="orders-stat">
          <div className="orders-stat-label">Revenue</div>
          <div className="orders-stat-value money">${summary.revenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Status filter */}
      <div className="orders-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`orders-filter ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="orders-empty">
          {orders.length === 0 ? 'No orders yet. They will appear here once a customer checks out.' : 'No orders with this status.'}
        </div>
      ) : (
        <div className="orders-card">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{String(order._id).slice(-6).toUpperCase()}</td>
                  <td className="order-date">{formatDate(order.createdAt)}</td>
                  <td>
                    <ul className="order-items">
                      {order.items.map((item, i) => (
                        <li key={`${item.productId}-${item.color || 'x'}-${i}`}>
                          {item.name} <span className="order-qty">× {item.quantity}</span>
                          {item.color && <span className="order-color"> · {item.color}</span>}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className={`pay-badge ${order.paymentMethod}`}>
                      {order.paymentMethod === 'cash' ? 'Cash on delivery' : 'Card'}
                    </span>
                  </td>
                  <td className="order-total">${order.total.toFixed(2)}</td>
                  <td>
                    <select
                      className={`status-select ${order.status}`}
                      value={order.status}
                      disabled={order.status === 'cancelled'}
                      onChange={(e) => {
                        const next = e.target.value;
                        if (
                          next === 'cancelled' &&
                          !window.confirm('Cancel this order? The items go back into stock.')
                        ) {
                          return;
                        }
                        onStatusChange(order._id, next);
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
