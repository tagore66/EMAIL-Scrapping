import React from 'react';
import { ExternalLink } from 'lucide-react';

const EmailTable = ({ emails }) => {
  return (
    <div className="glass card" style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: 600 }}>Recent Emails</h3>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.9rem'
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Sender</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Subject</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Category</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Amount</th>
            <th style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <tr key={email._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
              <td style={{ padding: '16px' }}>{email.sender.split('<')[0]}</td>
              <td style={{ padding: '16px' }}>{email.subject}</td>
              <td style={{ padding: '16px' }}>
                <span style={{ 
                  background: 'var(--border)', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem' 
                }}>
                  {email.category}
                </span>
              </td>
              <td style={{ padding: '16px', fontWeight: 600 }}>
                {email.amount > 0 ? `$${email.amount.toFixed(2)}` : '-'}
              </td>
              <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                {new Date(email.date).toLocaleDateString()}
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
