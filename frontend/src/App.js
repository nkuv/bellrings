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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: 40,
        minWidth: 340,
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: 32, color: '#2980b9', letterSpacing: 1 }}>Food Portal</h1>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <button
            style={{
              flex: 1,
              padding: '16px 0',
              background: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px rgba(52,152,219,0.08)'
            }}
            onClick={() => setRole('owner')}
            onMouseOver={e => e.currentTarget.style.background = '#217dbb'}
            onMouseOut={e => e.currentTarget.style.background = '#3498db'}
          >
            Owner Portal
          </button>
          <button
            style={{
              flex: 1,
              padding: '16px 0',
              background: '#2ecc71',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
              boxShadow: '0 2px 8px rgba(46,204,113,0.08)'
            }}
            onClick={() => setRole('student')}
            onMouseOver={e => e.currentTarget.style.background = '#219150'}
            onMouseOut={e => e.currentTarget.style.background = '#2ecc71'}
          >
            Student Portal
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
