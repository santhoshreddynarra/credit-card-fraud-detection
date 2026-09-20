import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle, Clock, Hash } from 'lucide-react';

const PredictionResult = ({ result, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 sm:p-6 animate-pulse">
        <div className="h-4 bg-gray-800 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-800 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 text-rose-300 text-xs flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Analysis Failed</h4>
          <p className="text-rose-300/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sm:p-8 text-center">
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-white">No Evaluation Active</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          Submit transaction parameters or select a sample preset to compute real-time fraud probability.
        </p>
      </div>
    );
  }

  const isFraud = result.is_fraud || result.prediction === 1;
  const probNum = result.fraud_probability !== undefined ? result.fraud_probability : 0;
  const probPct = (probNum * 100).toFixed(2);

  return (
    <div className={`border rounded-lg p-5 sm:p-6 transition-all ${
      isFraud
        ? 'bg-rose-950/20 border-rose-500/30'
        : 'bg-emerald-950/20 border-emerald-500/30'
    }`}>
      {/* Classification Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg border ${
            isFraud
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {isFraud ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              Classification Result
            </span>
            <div className={`text-lg font-bold tracking-tight mt-0.5 ${
              isFraud ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE TRANSACTION'}
            </div>
          </div>
        </div>

        {/* Probability Number */}
        <div className="text-right">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Fraud Risk
          </span>
          <div className={`text-xl font-bold font-mono tracking-tight mt-0.5 ${
            isFraud ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {probPct}%
          </div>
        </div>
      </div>

      {/* Visual Risk Probability Meter */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px] font-mono text-gray-400">
          <span>0% (Safe)</span>
          <span>50% (Threshold)</span>
          <span>100% (Fraud)</span>
        </div>
        <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-800">
          <div
            className={`h-full transition-all duration-500 ${isFraud ? 'bg-rose-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.max(probNum * 100, 2)}%` }}
          />
        </div>
      </div>

      {/* Metadata Audit Footer */}
      {(result.createdAt || result._id) && (
        <div className="pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400 font-mono">
          {result.createdAt && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>{new Date(result.createdAt).toLocaleTimeString()}</span>
            </div>
          )}
          {result._id && (
            <div className="flex items-center space-x-1">
              <Hash className="w-3.5 h-3.5 text-gray-500" />
              <span className="truncate max-w-[120px]">{result._id}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
