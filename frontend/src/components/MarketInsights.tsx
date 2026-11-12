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
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((json) => setData(json))
      .catch((err) => console.error('Error fetching market insights:', err));
  }, []);

  const originMultiplier = selectedOrigin === 'Lab-Grown' ? 0.35 : 1.0;
  const shapeMultiplier =
    selectedShape === 'Round'
      ? 1.0
      : selectedShape === 'Oval'
      ? 1.06
      : selectedShape === 'Princess'
      ? 0.9
      : selectedShape === 'Cushion'
      ? 0.93
      : 1.0;

  const summary = data?.summary ?? {
    average_price: 3932.8,
    average_carat: 0.8,
    popular_shape: 'Round',
    popular_carat_range: '0.70 - 1.20 ct',
    annual_price_change: '+4.2%',
    natural_index_movement: '+3.8%',
    lab_grown_price_movement: '-14.5%',
  };

  const priceByCarat = data?.price_by_carat ?? [
    { carat: '0.30 - 0.49 ct', avg_price: 820, price_per_carat: 2050 },
    { carat: '0.50 - 0.69 ct', avg_price: 1850, price_per_carat: 3080 },
    { carat: '0.70 - 0.99 ct', avg_price: 3620, price_per_carat: 4250 },
    { carat: '1.00 - 1.49 ct', avg_price: 7890, price_per_carat: 6310 },
    { carat: '1.50 - 1.99 ct', avg_price: 14200, price_per_carat: 8110 },
    { carat: '2.00 - 2.99 ct', avg_price: 24500, price_per_carat: 9800 },
  ];
  const maxCaratAvg = Math.max(...priceByCarat.map((r) => r.avg_price), 1);

  const shapeColors = ['bg-gold-500', 'bg-gold-400', 'bg-charcoal-700', 'bg-charcoal-500', 'bg-charcoal-400', 'bg-cream-400'];
  const shapeDistribution = (data?.shape_distribution ?? [
    { shape: 'Round', market_share: 68.2, avg_price: 4120 },
    { shape: 'Oval', market_share: 11.4, avg_price: 4380 },
    { shape: 'Princess', market_share: 8.5, avg_price: 3690 },
    { shape: 'Cushion', market_share: 5.1, avg_price: 3850 },
    { shape: 'Emerald', market_share: 3.8, avg_price: 4210 },
    { shape: 'Pear & Others', market_share: 3.0, avg_price: 3540 },
  ]).filter((s) => selectedShape === 'All' || s.shape.toLowerCase().includes(selectedShape.toLowerCase()));

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
          <p className="text-2xl font-bold text-charcoal-900 font-serif">
            {formatCurrency(summary.average_price * originMultiplier * shapeMultiplier)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {summary.annual_price_change} YoY Weighted Change
          </span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Average Carat Size</span>
            <Layers className="w-4 h-4 text-gold-600" />
          </div>
          <p className="text-2xl font-bold text-charcoal-900 font-serif">{summary.average_carat.toFixed(2)} ct</p>
          <span className="text-[11px] text-charcoal-500">Most Liquid: {summary.popular_carat_range}</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Natural Mined Index</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-serif">{summary.natural_index_movement}</p>
          <span className="text-[11px] text-charcoal-500">Stable geological scarcity</span>
        </div>

        <div className="glass-panel p-5 rounded-luxury border border-cream-300 space-y-1">
          <div className="flex items-center justify-between text-xs text-charcoal-400 font-semibold uppercase">
            <span>Lab-Grown Index</span>
            <TrendingDown className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 font-serif">{summary.lab_grown_price_movement}</p>
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
            <span className="text-xs font-bold text-gold-700 bg-gold-50 px-2 py-1 rounded">
              {selectedOrigin === 'Lab-Grown' ? 'Lab-Grown Benchmark' : 'Mined Baseline'}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {priceByCarat.map((row) => {
              const adjAvg = Math.round(row.avg_price * originMultiplier * shapeMultiplier);
              const adjPerCarat = Math.round(row.price_per_carat * originMultiplier * shapeMultiplier);
              const pct = Math.max(10, Math.round((row.avg_price / maxCaratAvg) * 100));
              return (
                <div key={row.carat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-charcoal-800">{row.carat}</span>
                    <span className="font-bold text-charcoal-900">
                      {formatCurrency(adjAvg)} ({formatCurrency(adjPerCarat)}/ct)
                    </span>
                  </div>
                  <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                    <div className="gold-gradient h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shape Market Share Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-luxury border border-cream-300 space-y-4">
          <div className="pb-3 border-b border-cream-300">
            <h3 className="font-bold text-base text-charcoal-900 font-serif">Market Share by Shape</h3>
            <p className="text-xs text-charcoal-500">Retail engagement & transaction liquidity</p>
          </div>

          <div className="space-y-3">
            {shapeDistribution.map((s, idx) => (
              <div key={s.shape} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-charcoal-800">{s.shape}</span>
                  <span className="text-charcoal-900">
                    {s.market_share}% · Avg {formatCurrency(s.avg_price * originMultiplier)}
                  </span>
                </div>
                <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                  <div className={`${shapeColors[idx % shapeColors.length]} h-full rounded-full`} style={{ width: `${s.market_share}%` }} />
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
