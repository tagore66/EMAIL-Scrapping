import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

const CategoryPie = ({ data }) => {
  return (
    <div className="glass card" style={{ height: '350px', width: '100%' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '1.1rem', fontWeight: 600 }}>Category Distribution</h3>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="_id"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--bg-dark)', 
              borderColor: 'var(--border)', 
              borderRadius: '8px',
              color: 'var(--text-main)' 
            }} 
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPie;
