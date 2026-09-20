import React from 'react';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

const Navbar = ({ health }) => {
  const isHealthy = health && health.status === 'ok';
  const isMlConnected = health && health.ml_service === 'connected';

  return (
    <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Credit Card Fraud Detection
              <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                XGBoost ML
              </span>
            </h1>
            <p className="text-xs text-slate-400">ML-powered transaction risk analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-medium">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border ${
            isHealthy && isMlConnected
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isHealthy && isMlConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>
              {isHealthy && isMlConnected 
                ? 'Services Active (Express + Python ML)' 
                : isHealthy 
                ? 'Backend Online (ML Offline)' 
                : 'Connecting to Backend...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
