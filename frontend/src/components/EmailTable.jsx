import React from 'react';
import { ExternalLink } from 'lucide-react';

const categoriesColor = {
  Shopping: 'rgba(56, 189, 248, 0.2)', // Blue
  Food: 'rgba(248, 113, 113, 0.2)', // Red
  Travel: 'rgba(34, 197, 94, 0.2)', // Green
  Bills: 'rgba(234, 179, 8, 0.2)', // Yellow
  Subscriptions: 'rgba(168, 85, 247, 0.2)', // Purple
  Others: 'var(--border)'
};

const categoryText = {
  Shopping: '#38bdf8',
  Food: '#f87171',
  Travel: '#22c55e',
  Bills: '#eab308',
  Subscriptions: '#a855f7',
  Others: 'var(--text-muted)'
};

const EmailTable = ({ emails, onView }) => {
  return (
    <div className="glass card" style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 600 }}>Transactions & Activities</h3>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.9rem'
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>Sender</th>
            <th style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>Subject</th>
            <th style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>Category</th>
            <th style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>Amount</th>
            <th style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>Date</th>
            <th style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email._id} className="table-row">
              <td style={{ padding: '16px', fontWeight: 500 }}>{email.sender.split('<')[0]}</td>
              <td style={{ padding: '16px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {email.subject}
              </td>
              <td style={{ padding: '16px' }}>
                <span style={{ 
                  background: categoriesColor[email.category] || categoriesColor.Others,
                  color: categoryText[email.category] || categoryText.Others,
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {email.category}
                </span>
              </td>
              <td style={{ padding: '16px', fontWeight: 700, color: email.amount > 0 ? 'var(--primary)' : 'inherit' }}>
                {email.amount > 0 ? `₹${email.amount.toLocaleString('en-IN')}` : '-'}
              </td>
              <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                {new Date(email.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
              <td style={{ padding: '16px' }}>
                <button 
                  onClick={() => onView(email)}
                  style={{ 
                    background: 'var(--primary)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  View Full
                </button>
              </td>
            </tr>
          ))}
          {emails.length === 0 && (
            <tr>
              <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No emails synced yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTable;
