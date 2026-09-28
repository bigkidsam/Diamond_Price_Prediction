import React, { useState } from 'react';
import { GitCompare, Plus, Trash2, Gem, Sparkles } from 'lucide-react';
import { PredictionResult } from '../types/diamond';

interface CompareDiamondsProps {
  comparisonList: PredictionResult[];
  onRemoveFromCompare: (id: string) => void;
  currency: string;
  onOpenPredictor: () => void;
}

export const CompareDiamonds: React.FC<CompareDiamondsProps> = ({
  comparisonList,
  onRemoveFromCompare,
  currency,
  onOpenPredictor,
}) => {
  // Fallback sample specimens for demonstration if list is empty
  const defaultSamples: any[] = [
    {
      id: 'sample-1',
      estimated_price: 6850,
      price_per_carat: 6850,
      diamond_profile: {
        carat: 1.0,
        shape: 'Round',
        cut: 'Ideal',
        color: 'F',
        clarity: 'VS1',
        depth: 61.8,
        table: 57.0,
        polish: 'Excellent',
        symmetry: 'Excellent',
        fluorescence: 'None',
        certification: 'GIA',
      },
    },
    {
      id: 'sample-2',
      estimated_price: 7950,
      price_per_carat: 6625,
      diamond_profile: {
        carat: 1.2,
        shape: 'Round',
        cut: 'Very Good',
        color: 'G',
        clarity: 'VS2',
        depth: 62.4,
        table: 58.0,
        polish: 'Very Good',
        symmetry: 'Very Good',
        fluorescence: 'Faint',
        certification: 'GIA',
      },
    },
    {
      id: 'sample-3',
      estimated_price: 5400,
      price_per_carat: 5684,
      diamond_profile: {
        carat: 0.95,
        shape: 'Princess',
        cut: 'Premium',
        color: 'E',
        clarity: 'VVS2',
        depth: 68.2,
        table: 72.0,
        polish: 'Excellent',
        symmetry: 'Very Good',
        fluorescence: 'None',
        certification: 'IGI',
      },
    },
  ];

  const diamondsToDisplay = comparisonList.length > 0 ? comparisonList.slice(0, 3) : defaultSamples;

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : '$';
    const rate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'INR' ? 86.5 : 1.0;
    return `${symbol}${(amount * rate).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-3">
          <GitCompare className="w-3.5 h-3.5 text-gold-600" />
          <span>Objective Comparative Analysis</span>
        </div>
        <h2 className="text-3xl font-bold text-charcoal-900 font-serif">Diamond Comparison Matrix</h2>
        <p className="text-sm text-charcoal-500 mt-2 max-w-xl mx-auto">
          Compare up to 3 diamonds side-by-side. Specs and pricing are laid out objectively without subjective declarations of which stone is &quot;best.&quot;
        </p>
      </div>

      {comparisonList.length === 0 && (
        <div className="bg-cream-100 border border-cream-300 p-4 rounded-xl text-center text-xs text-charcoal-600 flex items-center justify-center gap-2">
          <Gem className="w-4 h-4 text-gold-600" />
          <span>Displaying sample comparison specimens. Predict a diamond to add your own real stones!</span>
        </div>
      )}

      {/* Comparison Grid Table */}
      <div className="glass-panel rounded-luxury-lg shadow-luxury-lg border border-gold-300/40 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-cream-300 bg-cream-50/50">
              <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-charcoal-500 w-1/4">
                Feature Attribute
              </th>
              {diamondsToDisplay.map((d, idx) => (
                <th key={d.id} className="p-4 sm:p-5 text-center w-1/4 border-l border-cream-300">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-charcoal-900 font-serif">
                      Diamond {String.fromCharCode(65 + idx)}
                    </span>
                    {comparisonList.some((item) => item.id === d.id) && (
                      <button
                        onClick={() => onRemoveFromCompare(d.id)}
                        className="text-charcoal-400 hover:text-red-500 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gold-700 font-bold mt-1">
                    {formatCurrency(d.estimated_price)}
                  </p>
                </th>
              ))}
              {diamondsToDisplay.length < 3 && (
                <th className="p-4 text-center border-l border-cream-300 bg-cream-100/40">
                  <button
                    onClick={onOpenPredictor}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-cream-400 hover:border-gold-500 text-charcoal-500 hover:text-charcoal-900 transition-colors w-full"
                  >
                    <Plus className="w-5 h-5 mb-1 text-gold-600" />
                    <span className="text-xs font-semibold">Add Diamond</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200 text-xs text-charcoal-800">
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Carat Weight</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-bold text-sm text-charcoal-900">
                  {d.diamond_profile.carat} ct
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Shape</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-medium">
                  {d.diamond_profile.shape}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Cut Quality</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-semibold text-charcoal-900">
                  {d.diamond_profile.cut}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Color Grade</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-semibold">
                  Grade {d.diamond_profile.color}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Clarity Grade</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-semibold">
                  {d.diamond_profile.clarity}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Polish / Symmetry</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200">
                  {d.diamond_profile.polish} / {d.diamond_profile.symmetry}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Fluorescence</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200">
                  {d.diamond_profile.fluorescence}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Certification Lab</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-medium">
                  {d.diamond_profile.certification}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-charcoal-600 bg-cream-50/30">Price per Carat</td>
              {diamondsToDisplay.map((d) => (
                <td key={d.id} className="p-4 text-center border-l border-cream-200 font-bold text-gold-700">
                  {formatCurrency(d.price_per_carat || d.estimated_price / d.diamond_profile.carat)} /ct
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onOpenPredictor}
          className="gold-gradient text-charcoal-900 font-bold px-6 py-3 rounded-xl shadow-md text-xs hover:brightness-105"
        >
          Add New Diamond to Comparison
        </button>
      </div>
    </div>
  );
};
