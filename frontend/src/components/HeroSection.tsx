import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Gem, Cpu, Database } from 'lucide-react';

interface HeroSectionProps {
  onStartPrediction: () => void;
  onExploreGuide: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPrediction,
  onExploreGuide,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-diamond-200/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200 border border-gold-300 text-charcoal-800 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-600 animate-pulse" />
              <span>Calibrated Random Forest Valuation Intelligence (v1.0)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal-900 leading-[1.12]">
              Know What Your <br />
              <span className="gold-text-gradient italic">Diamond</span> Is Worth.
            </h1>

            <p className="text-lg sm:text-xl text-charcoal-500 font-normal max-w-2xl leading-relaxed">
              Estimate a diamond&apos;s market value using its physical characteristics, 4C quality grading, and historical pricing data trained across 53,920 authenticated stones.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartPrediction}
                className="gold-gradient text-charcoal-900 font-bold px-8 py-4 rounded-xl shadow-luxury-lg hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 text-base group"
              >
                <span>Predict Diamond Price</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreGuide}
                className="bg-white border border-cream-400 text-charcoal-700 font-semibold px-7 py-4 rounded-xl shadow-sm hover:bg-cream-100 hover:border-charcoal-400 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <span>Learn How It Works</span>
              </button>
            </div>

            {/* Trust Checklist Under Hero */}
            <div className="pt-6 border-t border-cream-300/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-luxury flex-shrink-0" />
                <span>Data-driven estimates</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-luxury flex-shrink-0" />
                <span>Detailed 4C analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-luxury flex-shrink-0" />
                <span>Instant valuation</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-charcoal-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-luxury flex-shrink-0" />
                <span>Transparent factors</span>
              </div>
            </div>

          </div>

          {/* Right Hero Luxury Diamond Visualization Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Luxury Glass Card */}
              <div className="glass-panel p-8 rounded-luxury-lg shadow-luxury-lg border border-gold-300/40 relative z-10 overflow-hidden">
                <div className="flex items-center justify-between pb-6 border-b border-cream-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-charcoal-900 text-gold-400 flex items-center justify-center">
                      <Gem className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-charcoal-900">Benchmark Specimen</h2>
                      <p className="text-xs text-charcoal-400">GIA Authenticated Spec</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold tracking-wider uppercase border border-emerald-200">
                    Live Model
                  </span>
                </div>

                {/* Faceted SVG Diamond Gem Graphic */}
                <div className="py-8 flex flex-col items-center justify-center relative">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-diamond-100 to-gold-50 flex items-center justify-center shadow-inner relative group">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-md text-gold-600">
                      {/* Modern Faceted Brilliant Round Diamond Path */}
                      <polygon points="25,35 75,35 90,50 50,90 10,50" fill="url(#gemGradient)" stroke="#8E6B2C" strokeWidth="1.2" strokeLinejoin="round" />
                      <polygon points="25,35 50,45 75,35 60,50 50,50 40,50" fill="#FCFAF2" fillOpacity="0.8" stroke="#8E6B2C" strokeWidth="0.8" />
                      <polygon points="50,45 50,90 40,50" fill="#EAD7B2" fillOpacity="0.7" stroke="#8E6B2C" strokeWidth="0.8" />
                      <polygon points="50,45 60,50 50,90" fill="#DFCA9B" fillOpacity="0.9" stroke="#8E6B2C" strokeWidth="0.8" />
                      <polygon points="10,50 25,35 40,50" fill="#F4EDE0" fillOpacity="0.8" stroke="#8E6B2C" strokeWidth="0.8" />
                      <polygon points="90,50 75,35 60,50" fill="#D4AF57" fillOpacity="0.8" stroke="#8E6B2C" strokeWidth="0.8" />
                      <defs>
                        <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFF9E6" />
                          <stop offset="50%" stopColor="#E5C78E" />
                          <stop offset="100%" stopColor="#C5A059" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Sparkle Badges */}
                    <div className="absolute top-4 right-6 bg-white/90 backdrop-blur-sm border border-gold-300 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-gold-600" />
                      <span className="text-[11px] font-bold text-charcoal-800">1.20 ct · Ideal</span>
                    </div>
                  </div>

                  {/* Sample Live Valuation Display */}
                  <div className="mt-6 text-center space-y-1">
                    <p className="text-xs uppercase tracking-widest text-charcoal-400 font-semibold">Estimated Market Value</p>
                    <div className="text-3xl font-bold text-charcoal-900 font-serif">
                      $8,450 <span className="text-sm font-sans font-normal text-charcoal-400">USD</span>
                    </div>
                    <p className="text-xs text-charcoal-500">
                      Range: <span className="font-semibold text-charcoal-700">$7,890 – $9,120</span> (±6.8%)
                    </p>
                  </div>
                </div>

                {/* Mini Stat Pills */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cream-300 text-center">
                  <div className="bg-cream-100 p-2 rounded-lg border border-cream-300">
                    <p className="text-[10px] text-charcoal-400 uppercase font-semibold">R² Score</p>
                    <p className="text-sm font-bold text-charcoal-900">0.981</p>
                  </div>
                  <div className="bg-cream-100 p-2 rounded-lg border border-cream-300">
                    <p className="text-[10px] text-charcoal-400 uppercase font-semibold">Trained On</p>
                    <p className="text-sm font-bold text-charcoal-900">53.9k</p>
                  </div>
                  <div className="bg-cream-100 p-2 rounded-lg border border-cream-300">
                    <p className="text-[10px] text-charcoal-400 uppercase font-semibold">RMSE</p>
                    <p className="text-sm font-bold text-charcoal-900">$548</p>
                  </div>
                </div>

              </div>

              {/* Floating Decorative Accent Badge */}
              <div className="absolute -bottom-5 -left-5 bg-charcoal-900 text-cream-100 p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gold-500/30 z-20">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gold-400 font-bold uppercase tracking-wider">Secondary Market</p>
                  <p className="text-sm font-bold text-white">Continuous Calibration</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
