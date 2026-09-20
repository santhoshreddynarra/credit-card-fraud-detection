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
      // 1. System Health Check
      const healthData = await getHealth().catch(() => ({ status: 'error', ml_service: 'disconnected' }));
      setHealth(healthData);

      // 2. Fetch Aggregate Stats
      setLoadingStats(true);
      const statsRes = await getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      setLoadingStats(false);

      // 3. Fetch Prediction Log History
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

  // Handle transaction risk analysis submit
  const handlePredict = async (transactionData) => {
    setLoadingPredict(true);
    setPredictError(null);

    try {
      const response = await createPrediction(transactionData);
      if (response.success) {
        setCurrentResult(response);
        // Refresh dashboard metrics & history
        loadDashboardData();
      } else {
        setPredictError(response.message || 'Prediction execution failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Backend service is currently unavailable.';
      setPredictError(msg);
    } finally {
      setLoadingPredict(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      <Navbar health={health} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Connection Failure Warning Banner */}
        {fetchError && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3.5 text-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{fetchError} Verify Express Server (Port 8000) and Python ML Engine (Port 5000).</span>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 rounded transition-colors flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* PRIMARY FOCUS AREA: Transaction Risk Evaluation & Live Result Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PredictionForm onSubmit={handlePredict} loading={loadingPredict} />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <PredictionResult result={currentResult} loading={loadingPredict} error={predictError} />
          </div>
        </div>

        {/* SECONDARY AREA: Statistics Metrics Summary */}
        <StatsCards stats={stats} loading={loadingStats} />

        {/* Analytics Charts */}
        <FraudChart stats={stats} loading={loadingStats} />

        {/* Historical Prediction Audit Log */}
        <PredictionHistory predictions={predictions} loading={loadingHistory} error={fetchError} />

      </main>

      <footer className="border-t border-gray-900 bg-gray-950 py-4 text-center text-xs text-gray-500">
        FraudShield Risk Platform &bull; Python XGBoost ML + Express Gateway + React Dashboard
      </footer>
    </div>
  );
};

export default Dashboard;
