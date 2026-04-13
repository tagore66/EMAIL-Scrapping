// Version: 1.0.5 - Performance Update
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EmailTable from '../components/EmailTable';
import { DollarSign, Mail, PieChart, Activity, RefreshCcw, Database, Filter, Calendar } from 'lucide-react';
import { getAnalytics, getEmails, syncEmails, reprocessEmails } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [emails, setEmails] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [dbTime, setDbTime] = useState(0);
  const [dataSource, setDataSource] = useState('DB');
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const emailsRes = await getEmails(userId);
      setEmails(emailsRes.data.emails);
      setFilteredEmails(emailsRes.data.emails);
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

  useEffect(() => {
    if (categoryFilter === 'All') {
      setFilteredEmails(emails);
    } else {
      setFilteredEmails(emails.filter(e => e.category === categoryFilter));
    }
  }, [categoryFilter, emails]);

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
              style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <Database size={16} />
              Reprocess
            </button>
            <button 
              onClick={handleSync} 
              disabled={syncing}
              className="btn-primary"
              style={{ height: '40px' }}
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

        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Intelligence Logs</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                 <Filter size={14} />
                 <select 
                   value={categoryFilter} 
                   onChange={(e) => setCategoryFilter(e.target.value)}
                   style={{ background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', cursor: 'pointer' }}
                 >
                   <option value="All">All Categories</option>
                   <option value="Shopping">Shopping</option>
                   <option value="Food">Food</option>
                   <option value="Travel">Travel</option>
                   <option value="Bills">Bills</option>
                   <option value="Subscriptions">Subscriptions</option>
                   <option value="Others">Others</option>
                 </select>
               </div>
            </div>
          </div>
          <EmailTable emails={filteredEmails} onViewEmail={(email) => setSelectedEmail(email)} />
        </div>
      </main>

      {/* Email View Modal */}
      {selectedEmail && (
        <div 
          onClick={() => setSelectedEmail(null)} // Click outside to close
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="card shadow-2xl" 
            style={{
            maxWidth: '800px', width: '100%', maxHeight: '85vh', 
            display: 'flex', flexDirection: 'column',
            padding: '0', position: 'relative', border: '1px solid var(--border)',
            overflow: 'hidden', backgroundColor: 'var(--bg-dark)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.01)' }}>
               <button 
                onClick={() => setSelectedEmail(null)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', height: '32px', width: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >✕</button>
              <span style={{ 
                fontSize: '0.7rem', 
                background: 'var(--primary)', 
                color: 'white',
                padding: '4px 10px',
                borderRadius: '4px',
                fontWeight: 700, 
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {selectedEmail.category}
              </span>
              <h2 style={{ fontSize: '1.25rem', marginTop: '12px', marginBottom: '4px', lineHeight: 1.3 }}>{selectedEmail.subject}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>From: <span style={{ color: 'var(--text-main)' }}>{selectedEmail.sender}</span></p>
            </div>

            {/* Modal Content */}
            <div style={{ 
              padding: '32px', 
              overflowY: 'auto', 
              fontSize: '0.95rem', 
              lineHeight: '1.7', 
              color: '#cbd5e1', 
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word', // CRITICAL FIX: prevents long URLs from stretching the modal
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.2)'
            }} className="custom-scrollbar">
              {selectedEmail.body || selectedEmail.snippet}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Received on: {new Date(selectedEmail.date).toLocaleString()}
              </div>
              {selectedEmail.amount > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>₹{selectedEmail.amount.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
