import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, trend }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="glass card"
      style={{ flex: 1, minWidth: '240px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ 
          background: `${color}20`, 
          padding: '12px', 
          borderRadius: '12px', 
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{ 
            color: trend.startsWith('+') ? 'var(--success)' : 'var(--danger)',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: trend.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            padding: '4px 8px',
            borderRadius: '6px',
            height: 'fit-content'
          }}>
            {trend}
          </span>
        )}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</p>
      <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</h3>
    </motion.div>
  );
};

export default StatCard;
