import React from 'react';
import { Mail, Bell, User, LogOut, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getTelemetry } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogs, setShowLogs] = React.useState(false);
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const userId = localStorage.getItem('userId');

  const fetchLogs = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await getTelemetry(userId);
      setLogs(res.data.logs);
    } catch (error) {
      console.error('Logs fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLogs = () => {
    if (!showLogs) fetchLogs();
    setShowLogs(!showLogs);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ 
      margin: '16px', 
      padding: '12px 24px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: '16px',
      zIndex: 1000
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--purple))',
          padding: '8px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Mail size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
          Mail<span style={{ color: 'var(--primary)' }}>Insights</span>
        </h2>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Dashboard</Link>
        <Link to="/telemetry" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Telemetry</Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <div 
              onClick={toggleLogs}
              style={{ padding: '8px', borderRadius: '50%', background: showLogs ? 'rgba(255,255,255,0.05)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              <Bell size={20} color={showLogs ? 'var(--primary)' : 'var(--text-muted)'} />
            </div>

            {showLogs && (
              <div className="glass card shadow-2xl" style={{
                position: 'absolute', top: '50px', right: '0', width: '300px',
                padding: '16px', zIndex: 1100, border: '1px solid var(--border)',
                backgroundColor: 'rgba(2, 6, 23, 0.95)'
              }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '16px', color: 'var(--text-main)', display: 'flex', justifyContent: 'space-between' }}>
                  System Activity
                  {loading && <RefreshCcw size={14} className="animate-spin" />}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {logs.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '12px' }}>No recent logs.</div>
                  ) : (
                    logs.map((log) => (
                      <div key={log._id} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${log.status === 'SUCCESS' ? 'var(--primary)' : 'var(--danger)'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{log.operation.replace('_', ' ')}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{log.durationMs}ms</span>
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {new Date(log.timestamp).toLocaleTimeString()} • {log.count || 0} items
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
