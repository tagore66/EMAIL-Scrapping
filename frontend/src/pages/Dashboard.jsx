import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EmailTable from '../components/EmailTable';
import { DollarSign, Mail, PieChart, Activity, RefreshCcw, Database, Filter, Calendar } from 'lucide-react';
import { getAnalytics, getEmails, syncEmails, reprocessEmails } from '../services/api';
import CategoryPie from '../components/Charts/CategoryPie';
import OverviewChart from '../components/Charts/OverviewChart';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const emailsRes = await getEmails(userId);
      setEmails(emailsRes.data.emails);
      setFilteredEmails(emailsRes.data.emails);
      setStats(emailsRes.data.stats);
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
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Spending Insights</h1>
              <span style={{ fontSize: '0.65rem', background: 'var(--border)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>ANALYTICS_V2</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Transforming raw mail data into structured financial intelligence.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
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
            title="Total Spending" 
            value={`₹${stats?.totalSpending?.toLocaleString('en-IN') || '0'}`} 
            icon={<DollarSign size={20} />} 
            color="#38bdf8"
          />
          <StatCard 
            title="Emails Analyzed" 
            value={emails.length} 
            icon={<Mail size={20} />} 
            color="#f87171"
          />
          <StatCard 
            title="Categories Identified" 
            value={Object.keys(stats?.categoryBreakdown || {}).length} 
            icon={<PieChart size={20} />} 
            color="#22c55e"
          />
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div className="glass card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Spending Trends</h3>
            <OverviewChart data={Object.entries(stats?.monthlyTrends || {}).map(([key, val]) => ({ _id: key, total: val }))} />
          </div>
          <div className="glass card" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem' }}>Category Distribution</h3>
            <CategoryPie data={Object.entries(stats?.categoryBreakdown || {}).map(([key, val]) => ({ _id: key, value: val }))} />
          </div>
        </div>

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
          <EmailTable emails={filteredEmails} />
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
