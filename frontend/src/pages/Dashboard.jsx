// Version: 1.0.5 - Performance Update
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { DollarSign, Mail, PieChart, Activity, RefreshCcw, Database } from 'lucide-react';
import { getEmails, syncEmails, reprocessEmails } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [dbTime, setDbTime] = useState(0);
  const [dataSource, setDataSource] = useState('DB');
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const emailsRes = await getEmails(userId);
      setEmails(emailsRes.data.emails);
      setStats(emailsRes.data.stats);
      setDbTime(emailsRes.data.dbDuration);
      setDataSource(emailsRes.data.source || 'DB');
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

  const handleReprocess = async () => {
    setSyncing(true);
    try {
      await reprocessEmails(userId);
      await fetchData();
    } catch (error) {
      console.error('Reprocess error:', error);
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
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Mail Intelligence</h1>
              <span style={{ fontSize: '0.65rem', background: 'var(--border)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>READER_MODE</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Comprehensive log of extracted and processed mail data.</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            {/* Performance Monitor Badge */}
            {dbTime > 0 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '6px 16px', 
                background: dataSource === 'CACHE' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${dataSource === 'CACHE' ? '#10b981' : 'var(--border)'}`,
                borderRadius: '20px',
                marginRight: '8px'
              }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  background: dataSource === 'CACHE' ? '#10b981' : 'var(--text-muted)',
                  boxShadow: dataSource === 'CACHE' ? '0 0 10px #10b981' : 'none'
                }} className={dataSource === 'CACHE' ? 'pulse-green' : ''} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Retrieval Speed</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: dataSource === 'CACHE' ? '#10b981' : 'var(--text-main)' }}>
                      {dbTime}ms
                    </span>
                    {dataSource === 'CACHE' && (
                      <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800 }}>
                        {(900 / dbTime).toFixed(1)}x Faster
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={handleReprocess} 
              disabled={syncing}
              className="glass"
              style={{ 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '0 16px', 
                borderRadius: '8px', 
                border: '1px solid var(--border)', 
                cursor: syncing ? 'not-allowed' : 'pointer',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                opacity: syncing ? 0.5 : 1
              }}
            >
              <Database size={16} color="var(--primary)" />
              Reprocess
            </button>
            <button 
              onClick={handleSync} 
              disabled={syncing}
              className="btn-primary"
              style={{ 
                height: '40px',
                color: '#020617', // Dark text on bright cyan background
                fontWeight: 700,
                border: 'none',
                cursor: syncing ? 'not-allowed' : 'pointer',
                opacity: syncing ? 0.7 : 1
              }}
            >
              <RefreshCcw size={16} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Syncing...' : 'Sync Data'}
            </button>
          </div>
        </header>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard 
            title="Total Spending Detected" 
            value={`₹${stats?.totalSpending?.toLocaleString('en-IN') || '0'}`} 
            icon={<DollarSign size={20} />} 
            color="#38bdf8"
          />
          <StatCard 
            title="Total Emails" 
            value={emails.length} 
            icon={<Mail size={20} />} 
            color="#f87171"
          />
        </section>

        {/* Visual Analytics */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div className="card glass" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <PieChart size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Spending Insights</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {Object.entries(stats.categoryBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([category, amount]) => {
                    const percentage = (amount / stats.totalSpending) * 100;
                    return (
                      <div key={category}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{category}</span>
                          <span style={{ color: 'var(--text-muted)' }}>₹{amount.toLocaleString('en-IN')} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${percentage}%`, 
                            background: 'linear-gradient(90deg, var(--primary), #8b5cf6)',
                            boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)'
                          }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="card glass" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Activity size={20} color="#8b5cf6" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Top Merchant Sources</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.entries(stats.topSenders)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([sender, count]) => (
                    <div key={sender} style={{ 
                      padding: '10px 16px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{sender}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{count} items</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ padding: '0 0 40px 0' }}>
          {/* Bottom spacer or secondary info could go here */}
        </div>
      </main>

      <style>{`
        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .pulse-green {
          animation: pulse-green 2s infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
