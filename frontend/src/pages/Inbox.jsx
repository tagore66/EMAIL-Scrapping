import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EmailTable from '../components/EmailTable';
import { getEmails } from '../services/api';
import { Filter, Search, Mail, Loader2 } from 'lucide-react';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmails(userId);
        setEmails(res.data.emails || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const filteredEmails = emails.filter(email => {
    const matchesCategory = categoryFilter === 'All' || email.category === categoryFilter;
    const matchesSearch = email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          email.sender?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <Navbar />
      <main style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Intelligence Ledger</h1>
            <span style={{ fontSize: '0.7rem', background: 'rgba(34, 211, 238, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>Active Database</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Search and inspect every extracted transaction from your mail stream.</p>
        </header>

        <div className="card glass" style={{ padding: '0', overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search sender or subject..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px 10px 36px', color: 'white', outline: 'none' }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', borderLeft: '1px solid var(--border)', height: '24px' }}>
                 <Filter size={14} color="var(--text-muted)" />
                 <select 
                   value={categoryFilter} 
                   onChange={(e) => setCategoryFilter(e.target.value)}
                   style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
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
            
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {filteredEmails.length} Intelligence Items
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          ) : (
            <EmailTable emails={filteredEmails} onViewEmail={(email) => setSelectedEmail(email)} />
          )}
        </div>
      </main>

      {/* Model View Copy-Paste from Dashboard */}
      {selectedEmail && (
        <div 
          onClick={() => setSelectedEmail(null)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card shadow-2xl" 
            style={{
            maxWidth: '800px', width: '100%', maxHeight: '85vh', 
            display: 'flex', flexDirection: 'column',
            padding: '0', position: 'relative', border: '1px solid var(--border)',
            overflow: 'hidden', backgroundColor: '#020617'
          }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)' }}>
               <button onClick={() => setSelectedEmail(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', height: '32px', width: '32px', borderRadius: '50%' }}>✕</button>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{selectedEmail.subject}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Source: {selectedEmail.sender}</p>
            </div>
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, whiteSpace: 'pre-wrap' }}>
              {selectedEmail.body || selectedEmail.snippet}
            </div>
            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{new Date(selectedEmail.date).toLocaleDateString()}</span>
              <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹{selectedEmail.amount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
