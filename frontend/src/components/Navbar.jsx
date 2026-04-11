import { Mail, Bell, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

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
      zIndex: 100
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
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={20} color="var(--text-muted)" />
          </div>
          <div 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem'
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
