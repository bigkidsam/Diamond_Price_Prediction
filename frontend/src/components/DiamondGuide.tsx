import React, { useState } from 'react';
import { BookOpen, Gem, Sparkles, Award, Shield, CheckCircle2, Sliders, Layers } from 'lucide-react';

export const DiamondGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'4cs' | 'shapes' | 'proportions' | 'lab_vs_natural' | 'certification'>('4cs');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn text-left">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-3">
          <BookOpen className="w-3.5 h-3.5 text-gold-600" />
          <span>Gemological Knowledge Base</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-900 font-serif">The DiamondIQ Masterclass</h2>
        <p className="text-sm text-charcoal-500 mt-2 max-w-xl mx-auto">
          An authoritative reference guide to understanding the 4Cs, optical proportions, laboratory certifications, and market pricing dynamics.
        </p>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap border-b border-cream-300 pb-4">
        {[
          { id: '4cs', label: 'The 4Cs Framework' },
          { id: 'shapes', label: 'Diamond Shapes & Facets' },
          { id: 'proportions', label: 'Anatomy & Proportions' },
          { id: 'lab_vs_natural', label: 'Natural vs. Lab-Grown' },
          { id: 'certification', label: 'Certifications (GIA/IGI)' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSection === sec.id
                ? 'bg-charcoal-900 text-gold-400 shadow-sm'
                : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Tab: The 4Cs */}
      {activeSection === '4cs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Cut */}
            <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <h3 className="font-bold text-lg text-charcoal-900 font-serif">1. Cut Quality</h3>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Often confused with shape, <strong>Cut</strong> refers to the precision of a diamond&apos;s facet angles, symmetry, and proportions. An <strong>Ideal/Excellent</strong> cut directs light into the crown and reflects it back through the table as brilliant white fire. Poorly cut stones leak light out the pavilion base, appearing lifeless regardless of high color or clarity.
              </p>
              <div className="p-3 bg-cream-100 rounded-lg text-[11px] text-charcoal-700">
                <strong>Market Rule:</strong> Cut represents the greatest single factor influencing visual beauty. Always prioritize Ideal or Excellent cut.
              </div>
            </div>

            {/* Color */}
            <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-3">
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-gold-600" />
                <h3 className="font-bold text-lg text-charcoal-900 font-serif">2. Color Grade</h3>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                The GIA D-to-Z scale measures the absence of color. Grade <strong>D</strong> is chemically pure and icy colorless. As nitrogen traces increase, diamonds slide towards faint yellow or brown. Grades <strong>G through J</strong> are &quot;Near Colorless&quot; and appear face-up white once set in jewelry at a fraction of D-tier cost.
              </p>
              <div className="p-3 bg-cream-100 rounded-lg text-[11px] text-charcoal-700">
                <strong>Sweet Spot:</strong> G or H color paired with platinum or white gold offers optimal market value.
              </div>
            </div>

            {/* Clarity */}
            <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gold-600" />
                <h3 className="font-bold text-lg text-charcoal-900 font-serif">3. Clarity Grade</h3>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Clarity evaluates internal microscopic characteristics (inclusions) and surface blemishes under 10x magnification. Grades span Flawless (FL), VVS, VS, SI, down to Included (I1–I3). <strong>VS1 and VS2</strong> stones are virtually 100% &quot;eye-clean&quot; (inclusions invisible without a microscope).
              </p>
              <div className="p-3 bg-cream-100 rounded-lg text-[11px] text-charcoal-700">
                <strong>Sweet Spot:</strong> VS1 or VS2 delivers genuine eye-clean purity without paying the steep luxury premium of VVS or Flawless.
              </div>
            </div>

            {/* Carat */}
            <div className="glass-panel p-6 rounded-luxury border border-cream-300 space-y-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gold-600" />
                <h3 className="font-bold text-lg text-charcoal-900 font-serif">4. Carat Weight</h3>
              </div>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Carat is weight, not visual diameter (1 ct = 0.20 grams). Because large diamond rough crystals are exponentially rarer in nature, diamond prices do not rise linearly — they jump exponentially at psychological threshold milestones (0.50 ct, 1.00 ct, 1.50 ct, 2.00 ct).
              </p>
              <div className="p-3 bg-cream-100 rounded-lg text-[11px] text-charcoal-700">
                <strong>Insider Tip:</strong> Buying a 0.95 ct diamond instead of 1.00 ct can save 15–20% with zero perceptible visual size difference.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab: Shapes */}
      {activeSection === 'shapes' && (
        <div className="glass-panel p-8 rounded-luxury border border-cream-300 space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-charcoal-900 font-serif">Diamond Shapes and Cutting Rough Yields</h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            The <strong>Round Brilliant</strong> cut commands the highest per-carat price premium on earth because cutting a round stone discards up to 50–55% of the original rough octahedral crystal. Fancy shapes retain significantly more rough crystal, allowing them to trade at a 10% to 25% discount per carat.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { name: 'Round Brilliant', facets: '57-58 facets', yield: '~45-50% rough yield', fire: 'Maximum brilliance' },
              { name: 'Princess Cut', facets: '57-76 facets', yield: '~80% rough yield', fire: 'Modern square sparkle' },
              { name: 'Emerald Cut', facets: 'Hall of mirrors', yield: '~70% rough yield', fire: 'Step-cut optical clarity' },
              { name: 'Oval Cut', facets: '56-58 facets', yield: '~65% rough yield', fire: 'Elongates fingers visually' },
            ].map((s) => (
              <div key={s.name} className="bg-white p-4 rounded-xl border border-cream-200 text-center space-y-1">
                <span className="font-bold text-sm text-charcoal-900">{s.name}</span>
                <p className="text-[11px] text-gold-700 font-semibold">{s.facets}</p>
                <p className="text-[10px] text-charcoal-400">{s.yield}</p>
                <p className="text-[10px] text-charcoal-500 font-medium pt-1">{s.fire}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Proportions */}
      {activeSection === 'proportions' && (
        <div className="glass-panel p-8 rounded-luxury border border-cream-300 space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-charcoal-900 font-serif">Anatomy and Optical Proportions</h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            A diamond&apos;s physical proportion measurements determine its light performance index. The primary metrics tracked by gemologists include:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-cream-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Table Percentage</span>
              <p className="text-xs text-charcoal-700">
                The top flat facet width divided by total diamond diameter. Ideal range is <strong>54.0% to 60.0%</strong>.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-cream-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Depth Percentage</span>
              <p className="text-xs text-charcoal-700">
                Total height from table to culet divided by width. Ideal range is <strong>59.5% to 62.9%</strong>. Too shallow causes &quot;fisheye&quot;; too deep causes darkness.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-cream-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700">Length-to-Width Ratio</span>
              <p className="text-xs text-charcoal-700">
                In fancy shapes (Oval, Pear, Emerald), ratio determines whether the stone looks graceful or stubby.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Natural vs Lab */}
      {activeSection === 'lab_vs_natural' && (
        <div className="glass-panel p-8 rounded-luxury border border-cream-300 space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-charcoal-900 font-serif">Natural vs. Lab-Grown Diamonds</h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Lab-grown diamonds are 100% genuine crystalline carbon, possessing the exact chemical, physical, and optical properties as mined diamonds. However, their market economics differ radically due to unlimited technological manufacturing scalability.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-cream-300 space-y-2">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-gold-600" />
                <span className="font-bold text-sm text-charcoal-900">Natural Mined Diamonds</span>
              </div>
              <ul className="text-xs text-charcoal-600 space-y-1.5 list-disc list-inside">
                <li>Formed 1 to 3 billion years ago deep in Earth&apos;s mantle</li>
                <li>Finite finite geological rarity with stable secondary resale liquidity</li>
                <li>Historically steady price benchmark preservation</li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border border-cream-300 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-diamond-500" />
                <span className="font-bold text-sm text-charcoal-900">Lab-Grown Diamonds (CVD / HPHT)</span>
              </div>
              <ul className="text-xs text-charcoal-600 space-y-1.5 list-disc list-inside">
                <li>Synthesized in high-tech reactor chambers over 2–6 weeks</li>
                <li>Identical refractive index (2.42) and Mohs hardness (10)</li>
                <li>Trades at 60–80% lower retail prices with minimal secondary resale value</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Certification */}
      {activeSection === 'certification' && (
        <div className="glass-panel p-8 rounded-luxury border border-cream-300 space-y-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-charcoal-900 font-serif">Gemological Grading Laboratories</h3>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Never purchase a significant diamond without third-party laboratory verification. However, different laboratories enforce varying strictness standards:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-cream-200 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gold-600" />
                <span className="font-bold text-xs text-charcoal-900">GIA (Gemological Institute of America)</span>
              </div>
              <p className="text-[11px] text-charcoal-600">
                The gold standard worldwide. Strictest color and clarity enforcement. Highest resale confidence.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cream-200 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-diamond-500" />
                <span className="font-bold text-xs text-charcoal-900">IGI (International Gemological Institute)</span>
              </div>
              <p className="text-[11px] text-charcoal-600">
                Global leader in lab-grown diamond certification and European commercial jewelry grading.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cream-200 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-charcoal-700" />
                <span className="font-bold text-xs text-charcoal-900">HRD Antwerp & AGS</span>
              </div>
              <p className="text-[11px] text-charcoal-600">
                Respected high-tier European and American laboratories with rigorous optical cut grading.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
