import React from 'react';

const StatCard = ({ title, value, change, trend, icon }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl hover:border-indigo-500/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}%
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
};

export default StatCard;
