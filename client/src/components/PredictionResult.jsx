import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock } from 'lucide-react';

const PredictionResult = ({ result, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-12 bg-slate-800 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-5 text-rose-300 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Prediction Failed</h4>
          <p className="text-xs text-rose-300/80 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500">
        <p className="text-sm font-medium">No transaction checked yet</p>
        <p className="text-xs text-slate-600 mt-1">Submit feature values above or select a preset sample to run model prediction.</p>
      </div>
    );
  }

  const isFraud = result.is_fraud || result.prediction === 1;
  const probabilityPct = (result.fraud_probability * 100).toFixed(4);

  return (
    <div className={`border rounded-xl p-6 transition-all ${
      isFraud
        ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
        : 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/30'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3.5 rounded-xl border ${
            isFraud
              ? 'bg-rose-500/20 border-rose-500/30 text-rose-400'
              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
          }`}>
            {isFraud ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Transaction Classification
            </span>
            <div className={`text-xl font-bold tracking-tight mt-0.5 ${
              isFraud ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {isFraud ? 'FRAUD DETECTED' : 'NORMAL TRANSACTION'}
            </div>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Fraud Probability
          </span>
          <div className={`text-2xl font-black mt-0.5 ${
            isFraud ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {probabilityPct}%
          </div>
        </div>
      </div>

      {result.createdAt && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Analyzed at: {new Date(result.createdAt).toLocaleString()}</span>
          </div>
          {result._id && (
            <span className="font-mono text-slate-600">ID: {result._id}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
