import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#94a3b8'];

const CategoryPie = ({ data }) => {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            nameKey="_id"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Total']}
            contentStyle={{ 
              backgroundColor: 'var(--bg-dark)', 
              borderColor: 'var(--border)', 
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '12px'
            }} 
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ paddingTop: '20px', fontSize: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPie;
