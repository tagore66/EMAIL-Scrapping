import React from 'react';
import { Mail, AlertCircle } from 'lucide-react';
import { fetchAuthUrl } from '../services/api';

const Login = () => {
  const handleLogin = async () => {
    try {
      const { data } = await fetchAuthUrl();
      window.location.href = data.url;
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundColor: 'var(--bg-dark)'
    }}>
      <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{
            background: 'var(--primary)',
            padding: '8px',
            borderRadius: '10px'
          }}>
            <Mail size={24} color="#0f172a" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>MailInsights</h1>
          {/* <span style={{ fontSize: '0.7rem', background: 'var(--border)', padding: '2px 8px', borderRadius: '4px', marginLeft: 'auto', fontWeight: 600 }}></span> */}
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '16px', lineHeight: 1.2, color: 'var(--text-main)' }}>
          Inbox Intelligence <span style={{ color: 'var(--primary)' }}>System.</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: 1.5 }}>
          Authorized analytics portal for processing mail data into categorized intelligence reports.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleLogin} className="btn-primary" style={{ width: '100%', justifyContent: 'center', height: '48px' }}>
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" style={{ width: '20px' }} />
            Sign in with Google
          </button>
        </div>


      </div>    </div>
  );
};

export default Login;
