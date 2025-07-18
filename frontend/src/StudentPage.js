import React from 'react';

function StudentPage({ onLogout }) {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <h2>Student Dashboard</h2>
      <p>Welcome! Here you can place orders and view your balance. (Placeholder)</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default StudentPage; 