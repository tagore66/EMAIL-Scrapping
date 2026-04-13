import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getTelemetry } from '../services/api';

const Telemetry = () => {
  const [data, setData] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await getTelemetry(userId);
        setData(res.data.logs || []);
      } catch (error) {
        console.error('Telemetry error:', error);
      }
    };
    fetchTelemetry();
  }, [userId]);

  return (
    <div>
      <Navbar />
      <main style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px' }}>System Telemetry</h1>
        <div className="glass card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '16px' }}>Operation</th>
                <th style={{ padding: '16px' }}>Count</th>
                <th style={{ padding: '16px' }}>Duration (ms)</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>{item.operation}</td>
                  <td style={{ padding: '16px' }}>{item.count || '-'}</td>
                  <td style={{ padding: '16px' }}>{item.durationMs || '-'}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      color: item.status === 'SUCCESS' ? 'var(--success)' : 'var(--danger)',
                      fontWeight: 600
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Telemetry;
