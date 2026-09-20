import React from 'react';
import { History, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

const PredictionHistory = ({ predictions, loading, error }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-blue-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Prediction Audit Log
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-mono">MongoDB History</span>
      </div>

      {loading ? (
        <div className="space-y-2 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-800/60 rounded animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-md text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Failed to load prediction history: {error}</span>
        </div>
      ) : !predictions || predictions.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-xs">
          No prediction records stored in database yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-950 text-gray-400 font-mono uppercase tracking-wider border-b border-gray-800 text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5 font-medium">Status</th>
                <th className="px-3.5 py-2.5 font-medium">Fraud Probability</th>
                <th className="px-3.5 py-2.5 font-medium">Amount</th>
                <th className="px-3.5 py-2.5 font-medium">Time</th>
                <th className="px-3.5 py-2.5 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {predictions.map((item) => {
                const isFraud = item.isFraud || item.prediction === 1;
                const amount = item.transactionData?.Amount !== undefined ? `$${item.transactionData.Amount.toFixed(2)}` : 'N/A';
                const time = item.transactionData?.Time !== undefined ? `${item.transactionData.Time}s` : 'N/A';
                const prob = (item.fraudProbability * 100).toFixed(2);

                return (
                  <tr key={item._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-3.5 py-2.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        isFraud
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {isFraud ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {isFraud ? 'FRAUD' : 'LEGITIMATE'}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-white">
                      {prob}%
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-gray-200">
                      {amount}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono text-gray-400">
                      {time}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;
