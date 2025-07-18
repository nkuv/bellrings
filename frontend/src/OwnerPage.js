import React, { useEffect, useState } from 'react';

function OwnerPage({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError('');
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().slice(0, 10);
        const res = await fetch(`/api/orders?day=${today}`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Network error');
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      padding: 32,
      background: '#f9f9f9',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <h2 style={{ margin: 0 }}>Owner Dashboard</h2>
        <button onClick={onLogout} style={{
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          cursor: 'pointer'
        }}>Logout</button>
      </header>
      <section>
        <h3>Orders Received Today</h3>
        {loading && <p style={{ color: '#2980b9' }}>Loading orders...</p>}
        {error && <div style={{ background: '#ffeaea', color: '#c0392b', padding: 10, borderRadius: 6, marginBottom: 12 }}>{error}</div>}
        {!loading && !error && (
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            background: '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <thead style={{ background: '#f1f1f1' }}>
              <tr>
                <th style={{ padding: 10, textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Student</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Day</th>
                <th style={{ padding: 10, textAlign: 'left' }}>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order.order_id} style={{ background: idx % 2 === 0 ? '#fafafa' : '#fff' }}>
                  <td style={{ padding: 10 }}>{order.order_id}</td>
                  <td style={{ padding: 10 }}>{order.student_username || 'N/A'}</td>
                  <td style={{ padding: 10 }}>{order.day || ''}</td>
                  <td style={{ padding: 10 }}>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {order.items && order.items.length > 0 && order.items[0] !== null
                        ? order.items.map((item, idx) => (
                            <li key={idx}>{item.name} x {item.quantity}</li>
                          ))
                        : 'No items'}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default OwnerPage; 