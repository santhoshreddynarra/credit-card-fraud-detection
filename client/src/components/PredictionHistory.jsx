import React from 'react';
import { History, ShieldAlert, ShieldCheck, AlertCircle } from 'lucide-react';

const PredictionHistory = ({ predictions, loading, error }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-sky-400" />
          Prediction History
        </h3>
        <span className="text-xs text-slate-400 font-mono">Recent Records</span>
      </div>

      {loading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-800/60 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Failed to load prediction history: {error}</span>
        </div>
      ) : !predictions || predictions.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <p className="text-sm">No transaction predictions recorded yet.</p>
          <p className="text-xs text-slate-600 mt-1">Predictions will be recorded here automatically.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Fraud Probability</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {predictions.map((item) => {
                const isFraud = item.isFraud || item.prediction === 1;
                const amount = item.transactionData?.Amount !== undefined ? `$${item.transactionData.Amount}` : 'N/A';
                const time = item.transactionData?.Time !== undefined ? `${item.transactionData.Time}s` : 'N/A';
                const prob = (item.fraudProbability * 100).toFixed(4);

                return (
                  <tr key={item._id} className="hover:bg-slate-800/30 transition-all">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isFraud
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isFraud ? <ShieldAlert className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                        {isFraud ? 'FRAUD' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-white">
                      {prob}%
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {amount}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {time}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
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
