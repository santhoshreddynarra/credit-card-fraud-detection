import React, { useState } from 'react';
import { ArrowRight, RotateCcw, ChevronDown, ChevronUp, Layers } from 'lucide-react';

const NORMAL_PRESET = {
  Time: 0.0, V1: -1.359807, V2: -0.072781, V3: 2.536346, V4: 1.378155,
  V5: -0.338320, V6: 0.462387, V7: 0.239598, V8: 0.098697, V9: 0.363786,
  V10: 0.090794, V11: -0.551599, V12: -0.617800, V13: -0.991389, V14: -0.311169,
  V15: 1.468176, V16: -0.470400, V17: 0.207971, V18: 0.025790, V19: 0.403992,
  V20: 0.251412, V21: -0.018306, V22: 0.277837, V23: -0.110474, V24: 0.066928,
  V25: 0.128539, V26: -0.189114, V27: 0.133558, V28: -0.021053, Amount: 149.62
};

const FRAUD_PRESET = {
  Time: 406.0, V1: -2.312226, V2: 1.951992, V3: -1.609850, V4: 3.997905,
  V5: -0.522187, V6: -1.426545, V7: -2.537387, V8: 1.391657, V9: -2.770089,
  V10: -2.772272, V11: 3.202033, V12: -2.899907, V13: -0.595221, V14: -4.289253,
  V15: 0.389724, V16: -1.140747, V17: -2.830055, V18: -0.016822, V19: 0.416955,
  V20: 0.126910, V21: 0.517237, V22: -0.035049, V23: -0.465211, V24: 0.320198,
  V25: 0.044519, V26: 0.177839, V27: 0.261145, V28: -0.143275, Amount: 0.0
};

const DEFAULT_FORM = {
  Time: 0,
  V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0, V8: 0, V9: 0, V10: 0,
  V11: 0, V12: 0, V13: 0, V14: 0, V15: 0, V16: 0, V17: 0, V18: 0, V19: 0, V20: 0,
  V21: 0, V22: 0, V23: 0, V24: 0, V25: 0, V26: 0, V27: 0, V28: 0,
  Amount: 0
};

const PredictionForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState(NORMAL_PRESET);
  const [showPca, setShowPca] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreset = (preset) => {
    setFormData(preset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericData = {};
    for (const key in formData) {
      numericData[key] = parseFloat(formData[key]) || 0;
    }
    onSubmit(numericData);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5 sm:p-6 shadow-sm">
      {/* Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Evaluate Transaction
          </h2>
          <p className="text-xs text-gray-400">
            Enter transaction parameters or load pre-validated dataset samples
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handlePreset(NORMAL_PRESET)}
            className="px-2.5 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded hover:bg-emerald-500/20 transition-colors"
          >
            Legitimate Sample
          </button>
          <button
            type="button"
            onClick={() => handlePreset(FRAUD_PRESET)}
            className="px-2.5 py-1 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded hover:bg-rose-500/20 transition-colors"
          >
            Fraudulent Sample
          </button>
          <button
            type="button"
            onClick={() => handlePreset(DEFAULT_FORM)}
            className="p-1 text-gray-400 hover:text-white bg-gray-800 rounded border border-gray-700 hover:bg-gray-700 transition-colors"
            title="Reset Form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Primary Features: Amount & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Transaction Amount ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm font-medium">
                $
              </span>
              <input
                type="number"
                step="any"
                name="Amount"
                value={formData.Amount}
                onChange={handleChange}
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-md pl-7 pr-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Elapsed Time (Seconds)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                name="Time"
                value={formData.Time}
                onChange={handleChange}
                required
                className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="0.0"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 text-xs font-mono">
                sec
              </span>
            </div>
          </div>
        </div>

        {/* PCA Features Toggle Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowPca(!showPca)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-950 border border-gray-800 rounded-md text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800/60 transition-all"
          >
            <div className="flex items-center space-x-2">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Anonymized PCA Features (V1 – V28)</span>
            </div>
            {showPca ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

        {/* Collapsible PCA Features Matrix */}
        {showPca && (
          <div className="p-3.5 bg-gray-950 border border-gray-800 rounded-md">
            <p className="text-[11px] text-gray-400 mb-3">
              Principal Component Analysis (PCA) features automatically extracted from transaction vectors:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 max-h-60 overflow-y-auto pr-1">
              {Array.from({ length: 28 }, (_, i) => `V${i + 1}`).map((vKey) => (
                <div key={vKey}>
                  <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                    {vKey}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={vKey}
                    value={formData[vKey] !== undefined ? formData[vKey] : 0}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm py-2.5 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing Risk via XGBoost Model...</span>
              </>
            ) : (
              <>
                <span>Analyze Transaction</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
