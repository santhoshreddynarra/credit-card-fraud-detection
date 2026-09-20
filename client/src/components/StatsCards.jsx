import React from 'react';
import { Activity, ShieldAlert, ShieldCheck, Percent } from 'lucide-react';

const StatsCards = ({ stats, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-2/3 mb-3"></div>
            <div className="h-8 bg-slate-800 rounded w-1/2"></div>
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

  const avgProbPercentage = (avgFraudProbability * 100).toFixed(2);

  const cardData = [
    {
      title: 'Total Transactions',
      value: totalPredictions.toLocaleString(),
      icon: Activity,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20'
    },
    {
      title: 'Fraud Detected',
      value: fraudPredictions.toLocaleString(),
      icon: ShieldAlert,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20'
    },
    {
      title: 'Normal Transactions',
      value: normalPredictions.toLocaleString(),
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      title: 'Avg Fraud Probability',
      value: `${avgProbPercentage}%`,
      icon: Percent,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cardData.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.borderColor} border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
