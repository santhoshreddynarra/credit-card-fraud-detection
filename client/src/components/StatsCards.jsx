import React from 'react';
import { Activity, ShieldAlert, ShieldCheck, Percent } from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-3 bg-gray-800 rounded w-1/2 mb-3"></div>
            <div className="h-7 bg-gray-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalPredictions = 0,
    fraudPredictions = 0,
    normalPredictions = 0,
    avgFraudProbability = 0
  } = stats || {};

  const avgProbPct = (avgFraudProbability * 100).toFixed(2);

  const cardItems = [
    {
      label: 'Total Predictions',
      value: totalPredictions.toLocaleString(),
      icon: Activity,
      iconColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/10'
    },
    {
      label: 'Fraud Detected',
      value: fraudPredictions.toLocaleString(),
      icon: ShieldAlert,
      iconColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/10'
    },
    {
      label: 'Legitimate Transactions',
      value: normalPredictions.toLocaleString(),
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10'
    },
    {
      label: 'Avg Fraud Probability',
      value: `${avgProbPct}%`,
      icon: Percent,
      iconColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-5 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <p className="text-2xl font-bold text-white tracking-tight">
                {item.value}
              </p>
            </div>
            <div className={`p-2.5 rounded-md ${item.badgeBg} ${item.iconColor} border border-gray-800`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
