import React from 'react';
import { ShieldCheck, Activity, Server, Cpu } from 'lucide-react';

const Navbar = ({ health }) => {
  const isExpressOk = health && health.status === 'ok';
  const isMlOk = health && health.ml_service === 'connected';

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Brand & App Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                FraudShield
              </h1>
              <span className="text-gray-500 text-sm">|</span>
              <span className="text-sm font-medium text-gray-300">
                Credit Card Fraud Risk Analysis
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-800 text-gray-300 border border-gray-700">
                XGBoost ML v1.0
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Enterprise real-time transaction classification engine
            </p>
          </div>
        </div>

        {/* System Microservice Status Indicators */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-gray-950 px-3 py-1.5 rounded-md border border-gray-800">
            <div className="flex items-center space-x-1 text-gray-400">
              <Server className="w-3.5 h-3.5" />
              <span>Express API</span>
            </div>
            <span className={`w-1.5 h-1.5 rounded-full ${isExpressOk ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          </div>

          <div className="flex items-center space-x-2 bg-gray-950 px-3 py-1.5 rounded-md border border-gray-800">
            <div className="flex items-center space-x-1 text-gray-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Python ML</span>
            </div>
            <span className={`w-1.5 h-1.5 rounded-full ${isMlOk ? 'bg-emerald-400' : 'bg-rose-500'}`} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
