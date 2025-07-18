import React, { useEffect, useState } from 'react';

function StudentPage({ onLogout }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderMsg, setOrderMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      // For demo, use studentId = 1 (adjust as needed)
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: 1, items: [{ menuItemId: selectedItem, quantity: Number(quantity) }] })
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

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h2>Student Dashboard</h2>
      <button onClick={onLogout} style={{ float: 'right' }}>Logout</button>
      <h3>Menu</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Item</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.name}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Place an Order</h3>
      <form onSubmit={handleOrder} style={{ marginBottom: 16 }}>
        <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} style={{ marginRight: 8 }}>
          {menuItems.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          style={{ width: 60, marginRight: 8 }}
        />
        <button type="submit" disabled={loading || !selectedItem}>
          {loading ? 'Placing...' : 'Order'}
        </button>
      </form>
      {orderMsg && <p style={{ color: 'green' }}>{orderMsg}</p>}
    </div>
  );
}

export default StudentPage; 