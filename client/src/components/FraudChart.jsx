import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const FraudChart = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 sm:p-6 h-60 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
        <div className="h-40 bg-gray-800/40 rounded"></div>
      </div>
    );
  }

  const {
    fraudPredictions = 0,
    normalPredictions = 0
  } = stats || {};

  const barData = [
    { name: 'Legitimate', count: normalPredictions, fill: '#10b981' },
    { name: 'Fraud Detected', count: fraudPredictions, fill: '#f43f5e' }
  ];

  const pieData = [
    { name: 'Legitimate', value: normalPredictions, color: '#10b981' },
    { name: 'Fraud Detected', value: fraudPredictions, color: '#f43f5e' }
  ];

  const hasData = normalPredictions > 0 || fraudPredictions > 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Risk Analytics & Distribution
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">Live Recharts</span>
      </div>

      {!hasData ? (
        <div className="text-center py-10 text-gray-400 text-xs">
          No transactions analyzed yet to generate charts.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-gray-950 p-4 border border-gray-800 rounded-md">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Total Classifications
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f9fafb', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-950 p-4 border border-gray-800 rounded-md">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Risk Distribution Proportion
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f9fafb', borderRadius: '6px', fontSize: '12px' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={30}
                    wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}
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
