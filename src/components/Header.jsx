import React from 'react';

export default function Header() {
  return (
    <div className="header">
      <div>
        <h1 style={{ margin: 0 }}>Radiation Dashboard</h1>
        <div style={{ color: '#6b7280', fontSize: 13 }}>Multi-sensor IoT — Mock mode</div>
      </div>
      <div>
        <button style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}>
          Simulate Device
        </button>
      </div>
    </div>
  );
}
