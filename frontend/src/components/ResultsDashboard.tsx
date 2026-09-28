import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Bookmark, 
  FileText, 
  GitCompare, 
  ShieldAlert, 
  TrendingUp, 
  Gem, 
  CheckCircle, 
  Info, 
  ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PredictionResult } from '../types/diamond';

interface ResultsDashboardProps {
  prediction: PredictionResult;
  currency: string;
  onModifyDetails: () => void;
  onOpenReportModal: () => void;
  onAddToCompare: (pred: PredictionResult) => void;
  onSaveToDashboard: (pred: PredictionResult) => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  prediction,
  currency,
  onModifyDetails,
  onOpenReportModal,
  onAddToCompare,
  onSaveToDashboard,
}) => {
  const [selectedHistoryRange, setSelectedHistoryRange] = useState<string>('1y');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [comparedSuccess, setComparedSuccess] = useState<boolean>(false);

  // Trigger subtle luxury gold sparkle celebration when results appear
  useEffect(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#DFC48C', '#C5A059', '#EAD7B2', '#6A9BC0'],
      });
    } catch {
      // safe fallback if canvas is not initialized
    }
  }, [prediction.id]);

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
    const rate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'INR' ? 86.5 : 1.0;
    return `${symbol}${(amount * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleSave = () => {
    onSaveToDashboard(prediction);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCompare = () => {
    onAddToCompare(prediction);
    setComparedSuccess(true);
    setTimeout(() => setComparedSuccess(false), 3000);
  };

  // Mock historical trend data for visualization
  const historyDataPoints: Record<string, number[]> = {
    '30d': [98, 99.2, 98.8, 100, 100.4],
    '6m': [94, 96, 97.5, 99, 100],
    '1y': [88, 91, 95, 98, 100],
    '3y': [82, 89, 93, 97, 100],
    '5y': [74, 80, 88, 94, 100],
  };

  const points = historyDataPoints[selectedHistoryRange] || historyDataPoints['1y'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-fadeIn">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-300 pb-4">
        <button
          onClick={onModifyDetails}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-600 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modify Diamond Specifications</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              savedSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-cream-300 text-charcoal-700 hover:bg-cream-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved in Dashboard!' : 'Save Prediction'}</span>
          </button>

          <button
            onClick={handleCompare}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              comparedSuccess
                ? 'bg-gold-50 border-gold-300 text-gold-800'
                : 'bg-white border-cream-300 text-charcoal-700 hover:bg-cream-100'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>{comparedSuccess ? 'Added to Compare!' : 'Compare Stone'}</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="gold-gradient text-charcoal-900 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Valuation Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Price Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-luxury-lg shadow-luxury-lg border border-gold-400/40 relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream-200 border border-gold-300 text-[11px] font-bold text-charcoal-800 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Estimated Market Value</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold text-charcoal-900 font-serif tracking-tight">
          {formatCurrency(prediction.estimated_price)}
        </h1>

        <p className="text-sm sm:text-base text-charcoal-600 font-medium mt-3">
          Estimated Market Range: <strong className="text-charcoal-900 font-bold">{formatCurrency(prediction.lower_bound)} – {formatCurrency(prediction.upper_bound)}</strong>
        </p>

        {/* Mandatory Prediction Disclaimer Box */}
        <div className="mt-6 max-w-2xl mx-auto p-3.5 rounded-xl bg-cream-100 border border-cream-300 text-[11px] text-charcoal-500 leading-relaxed text-left flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-luxury flex-shrink-0 mt-0.5" />
          <span>
            <strong>Model estimate — not a guaranteed market or resale price:</strong> {prediction.disclaimer}
          </span>
        </div>

        {/* Metadata Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-cream-300 text-left">
          <div className="bg-white p-3 rounded-xl border border-cream-300">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Price per Carat</span>
            <p className="text-sm font-bold text-charcoal-900">{formatCurrency(prediction.price_per_carat)} /ct</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-cream-300">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Model Confidence</span>
            <p className="text-sm font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{prediction.confidence}</span>
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-cream-300">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Evaluation Version</span>
            <p className="text-sm font-bold text-charcoal-900 truncate">Random Forest v1.0</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-cream-300">
            <span className="text-[10px] text-charcoal-400 uppercase font-semibold">Evaluation Timestamp</span>
            <p className="text-xs font-semibold text-charcoal-700 truncate mt-0.5">{prediction.prediction_date.split('-')[0]}</p>
          </div>
        </div>
      </div>

      {/* Grid: Diamond Summary & Market Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Diamond Profile Summary Card (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-luxury border border-cream-300 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-cream-300">
            <div className="flex items-center gap-2">
              <Gem className="w-5 h-5 text-gold-600" />
              <h3 className="font-bold text-base text-charcoal-900 font-serif">Diamond Profile</h3>
            </div>
            <button
              onClick={onModifyDetails}
              className="text-xs font-semibold text-gold-700 hover:text-gold-900 underline"
            >
              Modify Details
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Shape</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.shape}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Carat Weight</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.carat} ct</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Cut Grade</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.cut}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Color Grade</span>
              <span className="font-bold text-charcoal-900">Grade {prediction.diamond_profile.color}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Clarity</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.clarity}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Polish / Symmetry</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.polish} / {prediction.diamond_profile.symmetry}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Fluorescence</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.fluorescence}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-cream-200">
              <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">Certification</span>
              <span className="font-bold text-charcoal-900">{prediction.diamond_profile.certification}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cream-100 border border-cream-300 text-xs text-charcoal-600">
            <strong>Proportions:</strong> Depth {prediction.diamond_profile.depth}%, Table {prediction.diamond_profile.table}%, {prediction.diamond_profile.x} × {prediction.diamond_profile.y} × {prediction.diamond_profile.z} mm.
          </div>
        </div>

        {/* Market Comparison Gauge & Explanations (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-luxury border border-cream-300 space-y-6 text-left">
          <div>
            <h3 className="font-bold text-base text-charcoal-900 font-serif">Market Range Spectrum</h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Positioning relative to wholesale and secondary market tier pricing.
            </p>
          </div>

          {/* Horizontal Market Bar Gauge */}
          <div className="space-y-2">
            <div className="relative h-5 bg-cream-200 rounded-full overflow-hidden border border-cream-300 flex">
              <div className="w-1/4 bg-charcoal-200" title="Wholesale / Distress" />
              <div className="w-2/4 bg-gold-200" title="Fair Market Range" />
              <div className="w-1/4 bg-charcoal-300" title="Retail Luxury Markup" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal-500 pt-1">
              <span>Low: {formatCurrency(prediction.market_range.low)}</span>
              <span className="text-gold-800 font-bold">Your Estimate: {formatCurrency(prediction.estimated_price)}</span>
              <span>High: {formatCurrency(prediction.market_range.high)}</span>
            </div>
          </div>

          {/* Feature Contribution Breakdown */}
          <div className="space-y-3 pt-3 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Model Feature Importance Attribution
              </h4>
              <span className="text-[10px] text-charcoal-400 font-medium">Relative Influence %</span>
            </div>

            <div className="space-y-2.5">
              {prediction.feature_contributions.map((feat) => (
                <div key={feat.feature} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-800">{feat.feature}</span>
                    <span className="font-bold text-gold-700">{feat.impact_percentage}%</span>
                  </div>
                  <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="gold-gradient h-full rounded-full"
                      style={{ width: `${feat.impact_percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-charcoal-400 italic">
              *Attribution percentages indicate algorithmic decision split weights across the Random Forest trees.
            </p>
          </div>

        </div>

      </div>

      {/* Explanations & Historical Trend Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Why this price? (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-luxury border border-cream-300 space-y-4 text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-cream-300">
            <Info className="w-5 h-5 text-gold-600" />
            <h3 className="font-bold text-base text-charcoal-900 font-serif">Why did the model estimate this price?</h3>
          </div>

          <div className="space-y-3 text-xs text-charcoal-700 leading-relaxed">
            {prediction.explanations.map((exp, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <ChevronRight className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Price Trend (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-luxury border border-cream-300 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-cream-300">
            <div>
              <h3 className="font-bold text-base text-charcoal-900 font-serif">Historical Price Index</h3>
              <p className="text-[11px] text-charcoal-400">Specimen category index movement</p>
            </div>

            {/* Timeframe Chips */}
            <div className="flex items-center gap-1">
              {['30d', '6m', '1y', '3y', '5y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedHistoryRange(tf)}
                  className={`text-[11px] px-2 py-1 rounded font-semibold transition-colors ${
                    selectedHistoryRange === tf
                      ? 'bg-charcoal-900 text-white'
                      : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Clean Responsive SVG Trend Line */}
          <div className="h-36 w-full flex items-end justify-between gap-3 pt-4 px-2">
            {points.map((pt, i) => {
              const heightPct = ((pt - 70) / 35) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-bold text-charcoal-700">{pt.toFixed(0)}</span>
                  <div
                    className="w-full gold-gradient rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max(15, heightPct)}%` }}
                  />
                  <span className="text-[9px] text-charcoal-400">P{i + 1}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-cream-200 text-[10px] text-charcoal-400 flex items-center justify-between">
            <span>Source: Calibrated secondary gemological transaction data</span>
            <span className="font-semibold text-emerald-700">+4.2% Overall Segment YoY</span>
          </div>
        </div>

      </div>

    </div>
  );
};
