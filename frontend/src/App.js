import React, { useState } from 'react';
import OwnerPage from './OwnerPage';
import StudentPage from './StudentPage';

function App() {
  const [role, setRole] = useState(null);

  if (role === 'owner') {
    return <OwnerPage onLogout={() => setRole(null)} />;
  }
  if (role === 'student') {
    return <StudentPage onLogout={() => setRole(null)} />;
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Choose Portal</h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, padding: 10 }} onClick={() => setRole('owner')}>
          Owner Portal
        </button>
        <button style={{ flex: 1, padding: 10 }} onClick={() => setRole('student')}>
          Student Portal
        </button>
      </div>
    </div>
  );
}

export default App;
