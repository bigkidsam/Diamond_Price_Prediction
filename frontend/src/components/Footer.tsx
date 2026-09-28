import React from 'react';
import { Gem, ShieldAlert } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-cream-400/20 pt-16 pb-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-gold-glow">
                <Gem className="w-5 h-5 text-charcoal-900" />
              </div>
              <span className="text-2xl font-bold font-serif text-white tracking-tight">
                Diamond<span className="gold-text-gradient">IQ</span>
              </span>
            </div>
            <p className="text-xs text-charcoal-400 max-w-sm leading-relaxed">
              AI-powered diamond market value intelligence platform. Providing transparent, data-driven valuations across 53,920 authenticated gemological records.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Navigation</span>
            <ul className="space-y-1.5 text-xs text-charcoal-300">
              <li><button onClick={() => setActiveTab('predictor')} className="hover:text-gold-400">Price Predictor</button></li>
              <li><button onClick={() => setActiveTab('calculator')} className="hover:text-gold-400">Quick Calculator</button></li>
              <li><button onClick={() => setActiveTab('guide')} className="hover:text-gold-400">4Cs Diamond Guide</button></li>
              <li><button onClick={() => setActiveTab('insights')} className="hover:text-gold-400">Market Insights</button></li>
              <li><button onClick={() => setActiveTab('compare')} className="hover:text-gold-400">Compare Stones</button></li>
            </ul>
          </div>

          {/* Col 3: Management */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">Platform</span>
            <ul className="space-y-1.5 text-xs text-charcoal-300">
              <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-gold-400">User Dashboard</button></li>
              <li><button onClick={() => setActiveTab('admin')} className="hover:text-gold-400">Admin Telemetry</button></li>
              <li><span className="text-charcoal-500">API Documentation (/docs)</span></li>
              <li><span className="text-charcoal-500">Model Artifacts Integrity</span></li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box in Footer */}
        <div className="p-4 rounded-xl bg-charcoal-800 border border-charcoal-700 text-[11px] text-charcoal-400 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-luxury flex-shrink-0 mt-0.5" />
          <span>
            <strong>Legal Gemological Disclaimer:</strong> DiamondIQ provides mathematical market estimations derived from statistical machine learning models. It does not constitute an official appraisal, insurance certificate, certified gemological report, or binding cash purchase offer. Actual secondary and retail prices depend upon physical stone inspection, laboratory verification, buyer margins, and immediate marketplace liquidity.
          </span>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-500">
          <p>© {new Date().getFullYear()} DiamondIQ Systems. All rights reserved.</p>
          <p className="font-mono text-[11px] text-charcoal-500">Model Engine: Random Forest Pipeline v1.0 (53.9k specimens)</p>
        </div>
      </div>
    </footer>
  );
};
