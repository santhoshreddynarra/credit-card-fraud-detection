import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const FraudChart = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-64 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-40 bg-slate-800/60 rounded"></div>
      </div>
    );
  }

  const {
    fraudPredictions = 0,
    normalPredictions = 0
  } = stats || {};

  const barData = [
    { name: 'Normal', count: normalPredictions, fill: '#10b981' },
    { name: 'Fraud', count: fraudPredictions, fill: '#f43f5e' }
  ];

  const pieData = [
    { name: 'Normal Transactions', value: normalPredictions, color: '#10b981' },
    { name: 'Fraud Detected', value: fraudPredictions, color: '#f43f5e' }
  ];

  const hasData = normalPredictions > 0 || fraudPredictions > 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          Analytics & Class Distribution
        </h3>
        <span className="text-xs text-slate-400 font-mono">Live Metrics</span>
      </div>

      {!hasData ? (
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">No analytics data available yet.</p>
          <p className="text-xs text-slate-600 mt-1">Run predictions to populate charts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Classification Count
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-slate-950/40 p-4 border border-slate-800/80 rounded-xl">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Risk Proportion
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudChart;
