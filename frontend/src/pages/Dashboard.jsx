import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EmailTable from '../components/EmailTable';
import { DollarSign, Mail, PieChart, Activity, RefreshCcw } from 'lucide-react';
import { getAnalytics, getEmails, syncEmails } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [emails, setEmails] = useState([]);
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const [analyticsRes, emailsRes] = await Promise.all([
        getAnalytics(userId),
        getEmails(userId)
      ]);
      setAnalytics(analyticsRes.data);
      setEmails(emailsRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncEmails(userId);
      await fetchData();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-dark)', minHeight: '100vh' }}>
      <Navbar />
      
      <main style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '40px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Data Workspace</h1>
              <span style={{ fontSize: '0.65rem', background: 'var(--border)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>LIVE_SESSION</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive log of processed mail intelligence.</p>
          </div>
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className="btn-primary"
            style={{ height: '40px' }}
          >
            <RefreshCcw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing Intelligence...' : 'Sync Data'}
          </button>
        </header>

        <section style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <StatCard 
            title="Archives Processed" 
            value={emails.length} 
            icon={<Mail size={20} />} 
            color="var(--primary)"
          />
          <StatCard 
            title="Intelligence Tags" 
            value={analytics?.categoryDistribution?.length || 0} 
            icon={<PieChart size={20} />} 
            color="var(--success)"
          />
        </section>

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Recent Intelligence Logs</h3>
          </div>
          <EmailTable emails={emails} />
        </div>
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
