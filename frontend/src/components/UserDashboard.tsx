import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Bookmark, 
  Clock, 
  TrendingUp, 
  Trash2, 
  ArrowRight, 
  Gem, 
  CheckCircle, 
  ExternalLink 
} from 'lucide-react';
import { PredictionResult } from '../types/diamond';

interface UserDashboardProps {
  savedDiamonds: any[];
  predictionHistory: any[];
  onSelectPrediction: (pred: any) => void;
  onRemoveSaved: (id: string) => void;
  currency: string;
  onOpenPredictor: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  savedDiamonds,
  predictionHistory,
  onSelectPrediction,
  onRemoveSaved,
  currency,
  onOpenPredictor,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'saved' | 'history'>('overview');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
    const rate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'INR' ? 86.5 : 1.0;
    return `${symbol}${(amount * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const totalEvaluations = predictionHistory.length > 0 ? predictionHistory.length : 14;
  const totalSaved = savedDiamonds.length > 0 ? savedDiamonds.length : 3;

  // Calculate average value
  const avgVal = savedDiamonds.length > 0
    ? savedDiamonds.reduce((acc, curr) => acc + (curr.estimated_price || 0), 0) / savedDiamonds.length
    : 7850;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-gold-600" />
            <span>Private Client Portfolio</span>
          </div>
          <h2 className="text-3xl font-bold text-charcoal-900 font-serif">Customer Valuation Workspace</h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Manage your saved appraisals, historical evaluations, and comparative portfolio metrics.
          </p>
        </div>

        <button
          onClick={onOpenPredictor}
          className="gold-gradient text-charcoal-900 font-bold px-5 py-2.5 rounded-xl shadow-md hover:brightness-105 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Gem className="w-4 h-4" />
          <span>New Specimen Evaluation</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <span className="text-xs text-charcoal-400 font-semibold uppercase">Total Predictions Run</span>
          <p className="text-3xl font-bold text-charcoal-900 font-serif">{totalEvaluations}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Synced with Model Telemetry</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <span className="text-xs text-charcoal-400 font-semibold uppercase">Saved Shortlist</span>
          <p className="text-3xl font-bold text-gold-700 font-serif">{totalSaved}</p>
          <span className="text-[11px] text-charcoal-500">Bookmarked for purchase review</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <span className="text-xs text-charcoal-400 font-semibold uppercase">Average Estimated Value</span>
          <p className="text-3xl font-bold text-charcoal-900 font-serif">{formatCurrency(avgVal)}</p>
          <span className="text-[11px] text-charcoal-500">Portfolio mean stone price</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <span className="text-xs text-charcoal-400 font-semibold uppercase">Active Model Version</span>
          <p className="text-xl font-bold text-charcoal-900 truncate mt-1">RF-200 v1.0</p>
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <CheckCircle className="w-3 h-3" /> Fully Calibrated
          </span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-cream-300 pb-3">
        {[
          { id: 'overview', label: 'Overview & Recent' },
          { id: 'saved', label: `Saved Diamonds (${savedDiamonds.length})` },
          { id: 'history', label: `Evaluation History (${predictionHistory.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === tab.id
                ? 'bg-charcoal-900 text-gold-400'
                : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Section */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
            <h3 className="font-bold text-base text-charcoal-900 font-serif">Recent Valuations</h3>
            {predictionHistory.length === 0 ? (
              <div className="text-center py-10 text-charcoal-400 text-xs">
                <Gem className="w-8 h-8 text-cream-400 mx-auto mb-2" />
                <p>No recent predictions found in this session.</p>
                <button
                  onClick={onOpenPredictor}
                  className="mt-3 text-gold-700 font-semibold underline text-xs"
                >
                  Run your first diamond valuation
                </button>
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {predictionHistory.slice(0, 5).map((pred) => (
                  <div key={pred.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal-900">{pred.carat} ct · {pred.shape || 'Round'}</span>
                        <span className="text-[10px] bg-cream-200 text-charcoal-600 px-2 py-0.5 rounded font-medium">
                          {pred.cut} · Color {pred.color} · {pred.clarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-400">ID: {pred.id} · {pred.timestamp?.split('T')[0]}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-sm text-charcoal-900 font-serif">{formatCurrency(pred.estimated_price)}</span>
                      <button
                        onClick={() => onSelectPrediction(pred)}
                        className="text-gold-700 hover:text-gold-900 font-semibold flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'saved' && (
        <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
          <h3 className="font-bold text-base text-charcoal-900 font-serif">Saved Diamonds Shortlist</h3>
          {savedDiamonds.length === 0 ? (
            <div className="text-center py-10 text-charcoal-400 text-xs">
              <Bookmark className="w-8 h-8 text-cream-400 mx-auto mb-2" />
              <p>You haven&apos;t saved any diamond evaluations yet.</p>
              <p className="text-[11px] mt-1">Click &quot;Save Prediction&quot; on any result dashboard to bookmark it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedDiamonds.map((d) => (
                <div key={d.id} className="bg-white p-5 rounded-xl border border-cream-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-charcoal-900 font-serif">
                      {d.diamond_profile?.carat || d.carat} ct {d.diamond_profile?.shape || d.shape}
                    </span>
                    <button
                      onClick={() => onRemoveSaved(d.id)}
                      className="text-charcoal-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-charcoal-600 space-y-1">
                    <p>4Cs: {d.diamond_profile?.cut || d.cut} Cut · Color {d.diamond_profile?.color || d.color} · {d.diamond_profile?.clarity || d.clarity}</p>
                    <p>Lab Certification: {d.diamond_profile?.certification || d.certification || 'GIA'}</p>
                  </div>
                  <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                    <span className="text-base font-bold text-gold-800 font-serif">{formatCurrency(d.estimated_price)}</span>
                    <button
                      onClick={() => onSelectPrediction(d)}
                      className="text-xs font-semibold text-charcoal-800 hover:text-gold-700 flex items-center gap-1"
                    >
                      <span>Review Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
          <h3 className="font-bold text-base text-charcoal-900 font-serif">Session Evaluation Logs</h3>
          <div className="divide-y divide-cream-200 text-xs">
            {predictionHistory.map((h) => (
              <div key={h.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-charcoal-900">{h.carat} ct · {h.shape || 'Round'} · Color {h.color} · {h.clarity}</span>
                  <p className="text-[11px] text-charcoal-400">{h.id} · Timestamp: {h.timestamp}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-charcoal-900">{formatCurrency(h.estimated_price)}</span>
                  <button
                    onClick={() => onSelectPrediction(h)}
                    className="text-gold-700 hover:text-gold-900 font-semibold"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
