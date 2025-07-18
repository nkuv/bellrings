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
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
      <h2>Owner Dashboard</h2>
      <button onClick={onLogout} style={{ float: 'right' }}>Logout</button>
      <h3>Orders Received Today</h3>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Order ID</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Student</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Day</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{order.id}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{order.student ? order.student.username : 'N/A'}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{order.day || ''}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {order.MenuItems && order.MenuItems.length > 0 ? order.MenuItems.map(item => (
                      <li key={item.id}>{item.name} x {item.OrderItem.quantity}</li>
                    )) : 'No items'}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OwnerPage; 