import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, ArrowRight, Gem } from 'lucide-react';
import { DiamondShape, CutQuality, ColorGrade, ClarityGrade } from '../types/diamond';

interface QuickCalculatorProps {
  currency: string;
  onNavigateToFullPredictor: (prefillData: any) => void;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({
  currency,
  onNavigateToFullPredictor,
}) => {
  const [carat, setCarat] = useState<number>(1.0);
  const [shape, setShape] = useState<DiamondShape>('Round');
  const [cut, setCut] = useState<CutQuality>('Ideal');
  const [color, setColor] = useState<ColorGrade>('G');
  const [clarity, setClarity] = useState<ClarityGrade>('VS1');
  
  const [estimatedRange, setEstimatedRange] = useState<{ min: number; max: number; mid: number }>({
    min: 4800,
    max: 5600,
    mid: 5200,
  });

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
    const rate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'INR' ? 86.5 : 1.0;
    return `${symbol}${(amount * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Live ballpark estimation algorithm for quick calc
  useEffect(() => {
    const base = 2500 * Math.pow(carat, 1.8);
    const cutMultipliers: Record<CutQuality, number> = {
      'Ideal': 1.15,
      'Premium': 1.08,
      'Very Good': 1.0,
      'Good': 0.88,
      'Fair': 0.75,
    };
    const colorMultipliers: Record<ColorGrade, number> = {
      'D': 1.35, 'E': 1.25, 'F': 1.18, 'G': 1.08, 'H': 1.0, 'I': 0.90, 'J': 0.80, 'K': 0.70, 'L': 0.62, 'M': 0.55
    };
    const clarityMultipliers: Record<ClarityGrade, number> = {
      'FL': 1.45, 'IF': 1.35, 'VVS1': 1.25, 'VVS2': 1.18, 'VS1': 1.08, 'VS2': 1.0, 'SI1': 0.88, 'SI2': 0.75, 'I1': 0.55, 'I2': 0.45, 'I3': 0.35
    };

    const mid = base * (cutMultipliers[cut] || 1) * (colorMultipliers[color] || 1) * (clarityMultipliers[clarity] || 1);
    const shapeDiscount = shape === 'Round' ? 1.0 : 0.88;
    const finalMid = Math.round(mid * shapeDiscount);

    setEstimatedRange({
      min: Math.round(finalMid * 0.92),
      max: Math.round(finalMid * 1.08),
      mid: finalMid,
    });
  }, [carat, shape, cut, color, clarity]);

  const handleGoToFull = () => {
    onNavigateToFullPredictor({
      carat,
      shape,
      cut,
      color,
      clarity,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-3">
          <Sliders className="w-3.5 h-3.5 text-gold-600" />
          <span>Rapid Estimation Tool</span>
        </div>
        <h2 className="text-3xl font-bold text-charcoal-900 font-serif">Quick Diamond Price Calculator</h2>
        <p className="text-sm text-charcoal-500 mt-2 max-w-lg mx-auto">
          Need an immediate ballpark range? Adjust the 5 core parameters below for an instant preliminary market estimation.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-luxury-lg shadow-luxury-lg border border-gold-300/40 space-y-6">
        
        {/* Carat Slider */}
        <div className="space-y-2 bg-cream-100 p-4 rounded-xl border border-cream-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Carat Weight</span>
            <span className="text-base font-bold text-charcoal-900">{carat.toFixed(2)} ct</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.05"
            value={carat}
            onChange={(e) => setCarat(parseFloat(e.target.value))}
            className="w-full h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Shape, Cut, Color, Clarity Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Shape */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Shape</label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value as DiamondShape)}
              className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-800 outline-none"
            >
              {['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Pear', 'Marquise', 'Radiant'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Cut */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Cut Quality</label>
            <select
              value={cut}
              onChange={(e) => setCut(e.target.value as CutQuality)}
              className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-800 outline-none"
            >
              {['Ideal', 'Premium', 'Very Good', 'Good', 'Fair'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Color Grade</label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value as ColorGrade)}
              className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-800 outline-none"
            >
              {['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'].map((col) => (
                <option key={col} value={col}>Grade {col}</option>
              ))}
            </select>
          </div>

          {/* Clarity */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">Clarity Grade</label>
            <select
              value={clarity}
              onChange={(e) => setClarity(e.target.value as ClarityGrade)}
              className="w-full bg-white border border-cream-300 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-800 outline-none"
            >
              {['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1'].map((cl) => (
                <option key={cl} value={cl}>{cl}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Result Card */}
        <div className="bg-charcoal-900 text-white p-6 rounded-2xl text-center space-y-2 relative overflow-hidden">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">Estimated Quick Range</span>
          <div className="text-3xl sm:text-4xl font-bold font-serif text-white">
            {formatCurrency(estimatedRange.min)} – {formatCurrency(estimatedRange.max)}
          </div>
          <p className="text-xs text-charcoal-400 max-w-md mx-auto">
            Preliminary approximation. For calibrated precision including depth %, table %, exact mm dimensions, and laboratory certification, proceed to the full predictor.
          </p>
        </div>

        {/* CTA to Full Predictor */}
        <button
          onClick={handleGoToFull}
          className="w-full gold-gradient text-charcoal-900 font-bold py-3.5 rounded-xl shadow-md hover:shadow-gold-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
        >
          <span>Get Detailed Prediction (Full Engine)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
