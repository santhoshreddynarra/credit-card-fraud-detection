import React, { useState } from 'react';
import { Play, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

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
    // Convert all inputs to numbers
    const numericData = {};
    for (const key in formData) {
      numericData[key] = parseFloat(formData[key]) || 0;
    }
    onSubmit(numericData);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Transaction Risk Evaluator
          </h3>
          <p className="text-xs text-slate-400">Enter transaction features or load test presets</p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handlePreset(NORMAL_PRESET)}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Normal Preset
          </button>
          <button
            type="button"
            onClick={() => handlePreset(FRAUD_PRESET)}
            className="px-3 py-1.5 text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Fraud Preset
          </button>
          <button
            type="button"
            onClick={() => handlePreset(DEFAULT_FORM)}
            className="p-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"
            title="Reset form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primary Features (Time & Amount) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Transaction Time (Seconds)
            </label>
            <input
              type="number"
              step="any"
              name="Time"
              value={formData.Time}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-all"
              placeholder="e.g. 406.0"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Transaction Amount ($)
            </label>
            <input
              type="number"
              step="any"
              name="Amount"
              value={formData.Amount}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-sky-500 transition-all"
              placeholder="e.g. 149.62"
            />
          </div>
        </div>

        {/* PCA Features Toggle */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowPca(!showPca)}
            className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 focus:outline-none"
          >
            {showPca ? '▼ Hide PCA Features (V1 - V28)' : '▶ Show / Edit PCA Features (V1 - V28)'}
          </button>
        </div>

        {/* PCA Feature Grid (V1 through V28) */}
        {showPca && (
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
            <p className="text-xs text-slate-400">PCA Transformed Transaction Features (V1 to V28):</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {Array.from({ length: 28 }, (_, i) => `V${i + 1}`).map((vKey) => (
                <div key={vKey}>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-0.5">
                    {vKey}
                  </label>
                  <input
                    type="number"
                    step="any"
                    name={vKey}
                    value={formData[vKey] !== undefined ? formData[vKey] : 0}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running XGBoost Model Inference...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Check Transaction</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;
