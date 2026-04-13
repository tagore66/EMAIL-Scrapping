import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OverviewChart = ({ data }) => {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis 
            dataKey="_id" 
            stroke="var(--text-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--text-muted)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Spent']}
            contentStyle={{ 
              backgroundColor: 'var(--bg-dark)', 
              borderColor: 'var(--border)', 
              borderRadius: '8px',
              color: 'var(--text-main)',
              fontSize: '12px'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="var(--primary)" 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OverviewChart;
