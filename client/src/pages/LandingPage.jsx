import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Activity, Cpu, Lock, CheckCircle2, Server, Database, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="bg-gray-900/80 backdrop-blur border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">FraudShield</span>
              <span className="ml-2 text-xs text-gray-400 border-l border-gray-700 pl-2">Risk Platform</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-medium text-gray-300 hover:text-white transition-colors py-2 px-3"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-md transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>XGBoost Machine Learning Inference Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Detect fraudulent transactions before they impact your business
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Enterprise real-time transaction risk scoring powered by XGBoost, automated StandardScaler preprocessing, and secure MongoDB audit logging.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-3 px-6 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Start Analyzing Transactions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-300 font-medium text-sm py-3 px-6 rounded-md transition-colors text-center"
            >
              Live Demo Access
            </Link>
          </div>
        </div>
      </section>

      {/* Key Capabilities Grid */}
      <section className="py-16 border-b border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Core Capabilities
            </h2>
            <p className="text-2xl font-bold text-white tracking-tight">
              Production Fraud Detection Architecture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-3">
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-md w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Sub-Millisecond Inference</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Evaluates 30 transaction parameters against trained XGBoost trees with scale-adjusted imbalance weights (`scale_pos_weight`).
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md w-fit">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">JWT Protected Gateway</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Node.js Express API gateway enforces bcrypt password hashing, JWT user token verification, and user-isolated prediction history.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-3">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-md w-fit">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Audit Logs & Analytics</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Persistent MongoDB audit storage tracking transaction inputs, classification outputs, probability percentages, and Recharts statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works & Technology Stack Overview */}
      <section className="py-16 border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              System Pipeline
            </h2>
            <p className="text-2xl font-bold text-white tracking-tight">
              End-to-End Data Flow
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
              <span className="text-blue-400 font-bold">01. React Dashboard</span>
              <p className="text-gray-400 font-sans text-xs">
                Captures transaction parameters (`Amount`, `Time`, `V1`–`V28`) with client-side validation.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
              <span className="text-blue-400 font-bold">02. Express Gateway</span>
              <p className="text-gray-400 font-sans text-xs">
                Verifies JWT header, validates feature types, and proxies request to Python ML Service.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
              <span className="text-blue-400 font-bold">03. Python ML Engine</span>
              <p className="text-gray-400 font-sans text-xs">
                Scales `Time` and `Amount` via `StandardScaler` and runs XGBoost classifier inference.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-2">
              <span className="text-blue-400 font-bold">04. MongoDB Persistence</span>
              <p className="text-gray-400 font-sans text-xs">
                Saves record with authenticated `userId`, probability, and timestamp for audit queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-950 border-t border-gray-900 text-center text-xs text-gray-500 space-y-2">
        <p>FraudShield Risk Platform &bull; Built with React, Express, Python XGBoost ML & MongoDB</p>
        <p className="text-gray-600">&copy; {new Date().getFullYear()} FraudShield Security Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
