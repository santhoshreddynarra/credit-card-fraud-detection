import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import PredictionHistory from '../components/PredictionHistory';
import FraudChart from '../components/FraudChart';
import { getStats, getPredictions, createPrediction, getHealth } from '../services/api';
import { RefreshCw, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingPredict, setLoadingPredict] = useState(false);

  const [predictError, setPredictError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Fetch initial dashboard data
  const loadDashboardData = async () => {
    setFetchError(null);
    try {
      // 1. Health check
      const healthData = await getHealth().catch(() => ({ status: 'error', ml_service: 'disconnected' }));
      setHealth(healthData);

      // 2. Statistics
      setLoadingStats(true);
      const statsRes = await getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      setLoadingStats(false);

      // 3. History
      setLoadingHistory(true);
      const historyRes = await getPredictions(20);
      if (historyRes.success) {
        setPredictions(historyRes.data);
      }
      setLoadingHistory(false);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setFetchError(err.message || 'Failed to connect to backend service.');
      setLoadingStats(false);
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle transaction prediction submission
  const handlePredict = async (transactionData) => {
    setLoadingPredict(true);
    setPredictError(null);

    try {
      const response = await createPrediction(transactionData);
      if (response.success) {
        setCurrentResult(response);
        // Refresh stats and history log
        loadDashboardData();
      } else {
        setPredictError(response.message || 'Prediction execution failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Backend is currently unavailable.';
      setPredictError(msg);
    } finally {
      setLoadingPredict(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar health={health} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Global Fetch Error Banner */}
        {fetchError && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{fetchError}. Ensure Express backend (port 8000) & Python service (port 5000) are running.</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded-md transition-all flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Top Summary Statistics Cards */}
        <StatsCards stats={stats} loading={loadingStats} error={fetchError} />

        {/* Prediction Input Form & Result Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <PredictionForm onSubmit={handlePredict} loading={loadingPredict} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <PredictionResult result={currentResult} loading={loadingPredict} error={predictError} />
          </div>
        </div>

        {/* Visual Charts */}
        <FraudChart stats={stats} loading={loadingStats} />

        {/* Prediction History Log */}
        <PredictionHistory predictions={predictions} loading={loadingHistory} error={fetchError} />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-600">
        Credit Card Fraud Detection Dashboard &bull; React + Express + Python XGBoost ML
      </footer>
    </div>
  );
};

export default Dashboard;
