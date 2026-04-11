import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      localStorage.setItem('userId', userId);
      // Force a full refresh to ensure App.jsx reads the new localStorage value
      window.location.href = '/';
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div className="animate-spin" style={{ 
        width: '40px', 
        height: '40px', 
        border: '4px solid var(--border)', 
        borderTopColor: 'var(--primary)', 
        borderRadius: '50%',
        marginBottom: '20px'
      }}></div>
      <h2 style={{ fontWeight: 600 }}>Authenticating...</h2>
      <p style={{ color: 'var(--text-muted)' }}>Redirecting you to the dashboard.</p>
    </div>
  );
};

export default AuthSuccess;
