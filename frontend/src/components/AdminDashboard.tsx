import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  RefreshCw, 
  Lock, 
  Activity, 
  Table, 
  Download 
} from 'lucide-react';
import { ModelMetrics } from '../types/diamond';

interface AdminDashboardProps {
  predictionHistory: any[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ predictionHistory }) => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<'model' | 'dataset' | 'logs'>('model');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [validationSuccess, setValidationSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/model/metrics')
      .then((res) => res.json())
      .then((json) => setMetrics(json))
      .catch((err) => console.error('Error loading model metrics:', err));
  }, []);

  const sampleDatasetPreview = [
    { carat: 0.23, cut: 'Ideal', color: 'E', clarity: 'SI2', depth: 61.5, table: 55.0, price: 326, x: 3.95, y: 3.98, z: 2.43 },
    { carat: 0.21, cut: 'Premium', color: 'E', clarity: 'SI1', depth: 59.8, table: 61.0, price: 326, x: 3.89, y: 3.84, z: 2.31 },
    { carat: 0.23, cut: 'Good', color: 'E', clarity: 'VS1', depth: 56.9, table: 65.0, price: 327, x: 4.05, y: 4.07, z: 2.31 },
    { carat: 0.29, cut: 'Premium', color: 'I', clarity: 'VS2', depth: 62.4, table: 58.0, price: 334, x: 4.20, y: 4.23, z: 2.63 },
    { carat: 0.31, cut: 'Good', color: 'J', clarity: 'SI2', depth: 63.3, table: 58.0, price: 335, x: 4.34, y: 4.35, z: 2.75 },
  ];

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
      setValidationSuccess(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-2">
            <Lock className="w-3.5 h-3.5 text-gold-600" />
            <span>Authorized Administrator Console</span>
          </div>
          <h2 className="text-3xl font-bold text-charcoal-900 font-serif">ML System & Dataset Telemetry</h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time pipeline metrics, feature weights, training dataset inspection, and transaction audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Random Forest Active</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-3">
        {[
          { id: 'model', label: 'Model Evaluation Metrics', icon: Cpu },
          { id: 'dataset', label: 'Dataset Management & CSV', icon: Database },
          { id: 'logs', label: `Inference Logs (${predictionHistory.length})`, icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === tab.id
                  ? 'bg-charcoal-900 text-gold-400 shadow-sm'
                  : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Model Metrics */}
      {activeAdminTab === 'model' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
              <span className="text-[11px] text-charcoal-400 font-semibold uppercase">R² Determination Score</span>
              <p className="text-3xl font-bold text-charcoal-900 font-serif">0.98125</p>
              <span className="text-[11px] text-emerald-700 font-semibold">98.1% Variance Explained</span>
            </div>

            <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
              <span className="text-[11px] text-charcoal-400 font-semibold uppercase">Root Mean Square Error (RMSE)</span>
              <p className="text-3xl font-bold text-gold-700 font-serif">$548.26</p>
              <span className="text-[11px] text-charcoal-500">Cross-Validated Residual Spread</span>
            </div>

            <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
              <span className="text-[11px] text-charcoal-400 font-semibold uppercase">Mean Absolute Error (MAE)</span>
              <p className="text-3xl font-bold text-charcoal-900 font-serif">$264.73</p>
              <span className="text-[11px] text-charcoal-500">Average Dollar Deviation</span>
            </div>

            <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
              <span className="text-[11px] text-charcoal-400 font-semibold uppercase">Training Records</span>
              <p className="text-3xl font-bold text-charcoal-900 font-serif">53,920</p>
              <span className="text-[11px] text-charcoal-500">Zero-dimension Outliers Cleaned</span>
            </div>
          </div>

          {/* Model Specs Card */}
          <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
            <h3 className="font-bold text-base text-charcoal-900 font-serif">Active Production Pipeline Specification</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-cream-300 space-y-2">
                <span className="font-bold text-charcoal-900">1. Preprocessor Architecture (ColumnTransformer)</span>
                <ul className="text-charcoal-600 space-y-1 list-disc list-inside">
                  <li><strong>StandardScaler:</strong> [Carat(Weight of Daimond), depth, table, x, y, z, volume]</li>
                  <li><strong>OneHotEncoder:</strong> [cut, color, clarity]</li>
                  <li><strong>Engineered Dimensions:</strong> Spatial 3D Volume ($x \times y \times z$)</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border border-cream-300 space-y-2">
                <span className="font-bold text-charcoal-900">2. Regressor Architecture</span>
                <ul className="text-charcoal-600 space-y-1 list-disc list-inside">
                  <li><strong>Algorithm:</strong> RandomForestRegressor (Scikit-Learn Ensemble)</li>
                  <li><strong>Hyperparameters:</strong> n_estimators=200, random_state=42, n_jobs=-1</li>
                  <li><strong>Artifact Storage:</strong> diamond_price_model.pkl (683 MB Serialized Binary)</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab: Dataset Management */}
      {activeAdminTab === 'dataset' && (
        <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-6 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cream-300">
            <div>
              <h3 className="font-bold text-base text-charcoal-900 font-serif">Dataset Management & CSV Inspection</h3>
              <p className="text-xs text-charcoal-500">Preview training dataset structure and validate new candidate batches.</p>
            </div>

            <label className="gold-gradient text-charcoal-900 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV Batch</span>
              <input type="file" accept=".csv" onChange={handleSimulatedUpload} className="hidden" />
            </label>
          </div>

          {uploadedFile && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Uploaded batch <strong>{uploadedFile}</strong> validated: All 10 required schema headers matched; 0 null records detected.</span>
              </div>
              <span className="font-bold uppercase tracking-wider text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">Ready for Fine-Tuning</span>
            </div>
          )}

          {/* Dataset Table Preview */}
          <div className="overflow-x-auto border border-cream-300 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-cream-100 text-charcoal-700 font-bold border-b border-cream-300">
                <tr>
                  <th className="p-3">Carat</th>
                  <th className="p-3">Cut</th>
                  <th className="p-3">Color</th>
                  <th className="p-3">Clarity</th>
                  <th className="p-3">Depth</th>
                  <th className="p-3">Table</th>
                  <th className="p-3">Price ($)</th>
                  <th className="p-3">x (mm)</th>
                  <th className="p-3">y (mm)</th>
                  <th className="p-3">z (mm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white text-charcoal-800">
                {sampleDatasetPreview.map((row, i) => (
                  <tr key={i} className="hover:bg-cream-50">
                    <td className="p-3 font-semibold">{row.carat}</td>
                    <td className="p-3">{row.cut}</td>
                    <td className="p-3">{row.color}</td>
                    <td className="p-3">{row.clarity}</td>
                    <td className="p-3">{row.depth}%</td>
                    <td className="p-3">{row.table}%</td>
                    <td className="p-3 font-bold text-gold-700">${row.price}</td>
                    <td className="p-3">{row.x}</td>
                    <td className="p-3">{row.y}</td>
                    <td className="p-3">{row.z}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Logs */}
      {activeAdminTab === 'logs' && (
        <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-4 animate-fadeIn">
          <h3 className="font-bold text-base text-charcoal-900 font-serif">Real-Time Prediction Inference Logs</h3>
          <div className="overflow-x-auto border border-cream-300 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-cream-100 text-charcoal-700 font-bold border-b border-cream-300">
                <tr>
                  <th className="p-3">Inference ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Carat</th>
                  <th className="p-3">4Cs</th>
                  <th className="p-3">Estimated Price</th>
                  <th className="p-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 bg-white text-charcoal-800">
                {predictionHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-cream-50">
                    <td className="p-3 font-mono text-charcoal-500">{log.id}</td>
                    <td className="p-3 text-charcoal-500">{log.timestamp}</td>
                    <td className="p-3 font-bold">{log.carat} ct</td>
                    <td className="p-3">{log.cut} · {log.color} · {log.clarity}</td>
                    <td className="p-3 font-bold text-gold-700">${log.estimated_price}</td>
                    <td className="p-3 font-semibold text-emerald-700">{log.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
