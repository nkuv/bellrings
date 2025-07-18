import React, { useEffect, useState } from 'react';

function OwnerPage({ onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profit, setProfit] = useState(0);

  const fetchOrdersAndProfit = async () => {
    setLoading(true);
    setError('');
    try {
      const today = new Date().toISOString().slice(0, 10);
      const [ordersRes, profitRes] = await Promise.all([
        fetch(`/api/orders?day=${today}`),
        fetch(`/api/orders/profit?day=${today}`)
      ]);
      const ordersData = await ordersRes.json();
      const profitData = await profitRes.json();
      if (ordersRes.ok) {
        setOrders(ordersData);
      } else {
        setError(ordersData.message || 'Failed to fetch orders');
      }
      if (profitRes.ok) {
        setProfit(profitData.profit || 0);
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrdersAndProfit();
  }, []);

  const handleServe = async (orderId) => {
    await fetch(`/api/orders/serve/${orderId}`, { method: 'PATCH' });
    fetchOrdersAndProfit();
  };

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
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ margin: 0 }}>Today's Profit: <span style={{ color: '#27ae60' }}>₹{profit}</span></h3>
      </section>
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
                <th style={{ padding: 10, textAlign: 'left' }}>Status</th>
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
                  <td style={{ padding: 10, textAlign: 'center' }}>
                    {order.served ? (
                      <span style={{ color: '#27ae60', fontWeight: 'bold', fontSize: 22 }} title="Served">&#10003;</span>
                    ) : (
                      <button
                        style={{
                          background: '#3498db',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleServe(order.order_id)}
                      >
                        Mark as Served
                      </button>
                    )}
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