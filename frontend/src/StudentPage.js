import React, { useEffect, useState } from 'react';

function StudentPage({ onLogout }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderMsg, setOrderMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const studentId = 2; // hardcoded for demo

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        if (res.ok) {
          setMenuItems(data);
          if (data.length > 0) setSelectedItem(data[0].id);
        } else {
          setError(data.message || 'Failed to fetch menu');
        }
      } catch (err) {
        setError('Network error');
      }
    }
    fetchMenu();
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    setOrderMsg('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, items: [{ menuItemId: selectedItem, quantity: Number(quantity) }] })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderMsg('Order placed successfully!');
      } else {
        setError(data.message || 'Order failed');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  const handleQuickOrder = async () => {
    setOrderMsg('');
    setError('');
    setLoading(true);
    try {
      // Fetch most frequently ordered menu item for this student
      const res = await fetch(`/api/orders/frequent?studentId=${studentId}`);
      const data = await res.json();
      if (res.ok && data.menuItemId) {
        // Place order for 1 quantity of the most frequent item
        const orderRes = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, items: [{ menuItemId: data.menuItemId, quantity: 1 }] })
        });
        const orderData = await orderRes.json();
        if (orderRes.ok) {
          setOrderMsg(`Quick order placed for ${data.menuItemName}!`);
        } else {
          setError(orderData.message || 'Quick order failed');
        }
      } else {
        setError('No frequent order found for you yet.');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 700,
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
        <h2 style={{ margin: 0 }}>Student Dashboard</h2>
        <button onClick={onLogout} style={{
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          cursor: 'pointer'
        }}>Logout</button>
      </header>

      <section style={{ marginBottom: 32 }}>
        <h3>Menu</h3>
        {error && <div style={{ background: '#ffeaea', color: '#c0392b', padding: 10, borderRadius: 6, marginBottom: 12 }}>{error}</div>}
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
              <th style={{ padding: 10, textAlign: 'left' }}>Item</th>
              <th style={{ padding: 10, textAlign: 'left' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, idx) => (
              <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fafafa' : '#fff' }}>
                <td style={{ padding: 10 }}>{item.name}</td>
                <td style={{ padding: 10 }}>₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Place an Order</h3>
        <form onSubmit={handleOrder} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            {menuItems.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            style={{ width: 60, padding: 8, borderRadius: 6 }}
          />
          <button type="submit" disabled={loading || !selectedItem} style={{
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer'
          }}>
            {loading ? 'Placing...' : 'Order'}
          </button>
        </form>
        <button onClick={handleQuickOrder} disabled={loading} style={{
          background: '#2ecc71',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          cursor: 'pointer'
        }}>
          {loading ? 'Placing Quick Order...' : 'Quick Order (Most Frequent)'}
        </button>
        {orderMsg && <div style={{ background: '#eafaf1', color: '#27ae60', padding: 10, borderRadius: 6, marginTop: 12 }}>{orderMsg}</div>}
      </section>
    </div>
  );
}

export default StudentPage; 