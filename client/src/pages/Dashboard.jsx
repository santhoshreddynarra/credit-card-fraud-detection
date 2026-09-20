import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import PredictionHistory from '../components/PredictionHistory';
import FraudChart from '../components/FraudChart';
import { getStats, getPredictions, createPrediction, getHealth } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, AlertCircle, ArrowRight, PlayCircle, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingPredict, setLoadingPredict] = useState(false);

  const [predictError, setPredictError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Fetch initial dashboard data for authenticated user
  const loadDashboardData = async () => {
    setFetchError(null);
    try {
      // 1. Health check probe
      const healthData = await getHealth().catch(() => ({ status: 'error', ml_service: 'disconnected' }));
      setHealth(healthData);

      // 2. User-isolated statistics
      setLoadingStats(true);
      const statsRes = await getStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      setLoadingStats(false);

      // 3. User-isolated history log
      setLoadingHistory(true);
      const historyRes = await getPredictions(20);
      if (historyRes.success) {
        setPredictions(historyRes.data);
      }
      setLoadingHistory(false);

    } catch (err) {
      console.error('Error loading user dashboard data:', err);
      setFetchError(err.message || 'Failed to communicate with API Gateway.');
      setLoadingStats(false);
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle transaction prediction submit
  const handlePredict = async (transactionData) => {
    setLoadingPredict(true);
    setPredictError(null);

    try {
      const response = await createPrediction(transactionData);
      if (response.success) {
        setCurrentResult(response);
        // Refresh user's dashboard statistics and history log
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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Error Banner */}
        {fetchError && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 text-amber-300 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{fetchError} Ensure Express Gateway (Port 8000) & Python ML Service (Port 5000) are active.</span>
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

        {/* User Greeting & Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-gray-900">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Security Analyst'}
            </h1>
            <p className="text-xs text-gray-400">
              Monitor transaction risk scoring and analyze fraud probabilities in real time.
            </p>
          </div>

          {activeTab !== 'analyze' && (
            <button
              onClick={() => setActiveTab('analyze')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-3.5 rounded-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Analyze New Transaction</span>
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top 4 Summary Cards */}
            <StatsCards stats={stats} loading={loadingStats} />

            {/* Visual Recharts Analytics */}
            <FraudChart stats={stats} loading={loadingStats} />

            {/* Recent Activity Table (Last 5 Predictions) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Recent Transaction Activity
                </h3>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>View Full Log</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <PredictionHistory predictions={predictions.slice(0, 5)} loading={loadingHistory} error={fetchError} />
            </div>
          </div>
        )}

        {/* TAB 2: ANALYZE TRANSACTION */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <PredictionForm onSubmit={handlePredict} loading={loadingPredict} />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <PredictionResult result={currentResult} loading={loadingPredict} error={predictError} />
            </div>
          </div>
        )}

        {/* TAB 3: PREDICTION HISTORY LOG */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <PredictionHistory predictions={predictions} loading={loadingHistory} error={fetchError} />
          </div>
        )}

      </main>

      <footer className="border-t border-gray-900 bg-gray-950 py-4 text-center text-xs text-gray-500">
        FraudShield Security Platform &bull; User Session: {user?.email} &bull; Protected by JWT Authentication
      </footer>
    </div>
  );
};

export default Dashboard;
