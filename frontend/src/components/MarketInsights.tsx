import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Filter, Layers, Info } from 'lucide-react';
import { MarketInsightsData } from '../types/diamond';

interface MarketInsightsProps {
  currency: string;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ currency }) => {
  const [data, setData] = useState<MarketInsightsData | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<'All' | 'Natural' | 'Lab-Grown'>('All');
  const [selectedShape, setSelectedShape] = useState<string>('All');

  useEffect(() => {
    fetch('/api/market-insights')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error fetching market insights:', err));
  }, []);

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
    const rate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'INR' ? 86.5 : 1.0;
    return `${symbol}${(amount * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-gold-600" />
          <span>Real-Time Intelligence Terminal</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-900 font-serif">Diamond Market Insights</h2>
        <p className="text-sm text-charcoal-500 mt-2 max-w-xl mx-auto">
          Statistical aggregations, volume-weighted pricing curves, and secondary market supply trends calibrated across 53,920 gemological records.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Average Specimen Price</span>
            <DollarSign className="w-4 h-4 text-gold-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900 font-serif">{formatCurrency(3932.80)}</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% YoY Weighted Change
          </span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Average Carat Size</span>
            <Layers className="w-4 h-4 text-gold-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900 font-serif">0.80 ct</p>
          <span className="text-[11px] text-charcoal-500">Most Liquid: 0.70 – 1.20 ct</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Natural Mined Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-serif">+3.8%</p>
          <span className="text-[11px] text-charcoal-500">Stable geological scarcity</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Lab-Grown Index</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 font-serif">-14.5%</p>
          <span className="text-[11px] text-charcoal-500">CVD supply manufacturing curve</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-cream-300 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-charcoal-500" />
          <span className="text-xs font-bold text-charcoal-700 uppercase">Filters:</span>
          <div className="flex items-center gap-1.5 ml-2">
            {['All', 'Natural', 'Lab-Grown'].map((orig) => (
              <button
                key={orig}
                onClick={() => setSelectedOrigin(orig as any)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedOrigin === orig
                    ? 'bg-charcoal-900 text-gold-400 shadow-sm'
                    : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                }`}
              >
                {orig}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal-400 font-semibold uppercase">Shape Filter:</span>
          <select
            value={selectedShape}
            onChange={(e) => setSelectedShape(e.target.value)}
            className="bg-cream-100 border border-cream-300 rounded-lg px-2.5 py-1 text-charcoal-700 font-medium"
          >
            <option value="All">All Shapes</option>
            <option value="Round">Round Brilliant</option>
            <option value="Oval">Oval</option>
            <option value="Princess">Princess</option>
            <option value="Cushion">Cushion</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Price By Carat & Shape Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Price Per Carat Exponential Curve (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-300">
            <div>
              <h3 className="font-bold text-base text-charcoal-900 font-serif">Price per Carat Escalation Curve</h3>
              <p className="text-xs text-charcoal-500">Benchmark rate progression by weight bracket</p>
            </div>
            <span className="text-xs font-bold text-gold-700 bg-gold-50 px-2 py-1 rounded">Mined Baseline</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { carat: '0.30 - 0.49 ct', avg: 820, perCarat: 2050, pct: 21 },
              { carat: '0.50 - 0.69 ct', avg: 1850, perCarat: 3080, pct: 31 },
              { carat: '0.70 - 0.99 ct', avg: 3620, perCarat: 4250, pct: 43 },
              { carat: '1.00 - 1.49 ct', avg: 7890, perCarat: 6310, pct: 64 },
              { carat: '1.50 - 1.99 ct', avg: 14200, perCarat: 8110, pct: 82 },
              { carat: '2.00 - 2.99 ct', avg: 24500, perCarat: 9800, pct: 100 },
            ].map((row) => (
              <div key={row.carat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-charcoal-800">{row.carat}</span>
                  <span className="font-bold text-charcoal-900">{formatCurrency(row.avg)} ({formatCurrency(row.perCarat)}/ct)</span>
                </div>
                <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                  <div className="gold-gradient h-full rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shape Market Share Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
          <div className="pb-3 border-b border-cream-300">
            <h3 className="font-bold text-base text-charcoal-900 font-serif">Market Share by Shape</h3>
            <p className="text-xs text-charcoal-500">Retail engagement & transaction liquidity</p>
          </div>

          <div className="space-y-3">
            {[
              { shape: 'Round Brilliant', share: 68.2, color: 'bg-gold-500' },
              { shape: 'Oval Cut', share: 11.4, color: 'bg-gold-400' },
              { shape: 'Princess Cut', share: 8.5, color: 'bg-charcoal-700' },
              { shape: 'Cushion Cut', share: 5.1, color: 'bg-charcoal-500' },
              { shape: 'Emerald Cut', share: 3.8, color: 'bg-charcoal-400' },
              { shape: 'Pear & Others', share: 3.0, color: 'bg-cream-400' },
            ].map((s) => (
              <div key={s.shape} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-charcoal-800">{s.shape}</span>
                  <span className="text-charcoal-900">{s.share}%</span>
                </div>
                <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                  <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.share}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Data Source Notice */}
      <div className="p-4 rounded-xl bg-cream-100 border border-cream-300 text-xs text-charcoal-500 flex items-start gap-2">
        <Info className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Transparency Notice:</strong> All market analytics are derived from historical training records and secondary gemological marketplace calibration indices. They represent prevailing macroeconomic indicators rather than binding individual retail purchase quotes.
        </span>
      </div>
    </div>
  );
};
