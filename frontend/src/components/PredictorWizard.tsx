import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  Check, 
  Shield, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Info, 
  Gem, 
  Maximize2 
} from 'lucide-react';
import { 
  DiamondInput, 
  DiamondShape, 
  CutQuality, 
  ColorGrade, 
  ClarityGrade, 
  PolishGrade, 
  SymmetryGrade, 
  FluorescenceGrade, 
  DiamondOrigin, 
  CertificationLab 
} from '../types/diamond';

interface PredictorWizardProps {
  onPredictionComplete: (predictionData: any) => void;
  currency: string;
}

export const PredictorWizard: React.FC<PredictorWizardProps> = ({
  onPredictionComplete,
  currency,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<DiamondInput>({
    carat: 1.0,
    shape: 'Round',
    diamond_type: 'Natural',
    cut: 'Ideal',
    color: 'G',
    clarity: 'VS1',
    polish: 'Excellent',
    symmetry: 'Excellent',
    fluorescence: 'None',
    x: 6.45,
    y: 6.48,
    z: 3.98,
    depth: 61.5,
    table: 57.0,
    certification: 'GIA',
    certificate_number: '2235918234',
  } as any);

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Calculate live volume
  const liveVolume = (formData.x * formData.y * formData.z).toFixed(2);

  const shapes: { name: DiamondShape; desc: string }[] = [
    { name: 'Round', desc: 'Classic 57-facet brilliant' },
    { name: 'Princess', desc: 'Modern square brilliant' },
    { name: 'Cushion', desc: 'Soft pillow vintage outline' },
    { name: 'Oval', desc: 'Elongated optical brilliance' },
    { name: 'Emerald', desc: 'Step-cut hall-of-mirrors' },
    { name: 'Pear', desc: 'Teardrop silhouette' },
    { name: 'Marquise', desc: 'Navette eye shape' },
    { name: 'Radiant', desc: 'Brilliant faceted rectangular' },
    { name: 'Asscher', desc: 'Square vintage step-cut' },
    { name: 'Heart', desc: 'Symbolic romantic cut' },
  ];

  const cuts: { grade: CutQuality; desc: string }[] = [
    { grade: 'Ideal', desc: 'Maximum optical brilliance & fire (>99% light return)' },
    { grade: 'Premium', desc: 'Near-perfect proportions with superior luster' },
    { grade: 'Very Good', desc: 'Reflects nearly all light, exceptional value' },
    { grade: 'Good', desc: 'Reflects most light with slight proportion tradeoffs' },
    { grade: 'Fair', desc: 'Light escapes through sides or bottom pavilion' },
  ];

  const colors: { grade: ColorGrade; tier: string; note: string }[] = [
    { grade: 'D', tier: 'Colorless', note: 'Highest possible grade, icy white' },
    { grade: 'E', tier: 'Colorless', note: 'Minute traces detectable by gemologist only' },
    { grade: 'F', tier: 'Colorless', note: 'Exceptional transparency & fire' },
    { grade: 'G', tier: 'Near Colorless', note: 'Optimal balance of beauty & market value' },
    { grade: 'H', tier: 'Near Colorless', note: 'Warmth invisible to untrained eye once set' },
    { grade: 'I', tier: 'Near Colorless', note: 'Slight warmth, great budget value' },
    { grade: 'J', tier: 'Near Colorless', note: 'Subtle tone, looks stunning in yellow gold' },
    { grade: 'K', tier: 'Faint Tint', note: 'Warm body tone visible in large carats' },
    { grade: 'L', tier: 'Faint Tint', note: 'Noticeable champagne tint' },
    { grade: 'M', tier: 'Faint Tint', note: 'Distinct yellow tint' },
  ];

  const clarities: { grade: ClarityGrade; desc: string }[] = [
    { grade: 'FL', desc: 'Flawless: No inclusions or blemishes under 10x magnification' },
    { grade: 'IF', desc: 'Internally Flawless: Clean interior with only surface polish micro-traces' },
    { grade: 'VVS1', desc: 'Very Very Slightly Included: Minute pinpoint inclusions extremely hard to find' },
    { grade: 'VVS2', desc: 'Very Very Slightly Included: Trace inclusions visible with difficulty under 10x' },
    { grade: 'VS1', desc: 'Very Slightly Included: Minor inclusions invisible to naked eye' },
    { grade: 'VS2', desc: 'Very Slightly Included: Small inclusions, clean face-up appearance' },
    { grade: 'SI1', desc: 'Slightly Included: Noticeable under 10x, often eye-clean' },
    { grade: 'SI2', desc: 'Slightly Included: Inclusions visible under close inspection' },
    { grade: 'I1', desc: 'Included 1: Inclusions evident to naked eye, affects brilliance' },
    { grade: 'I2', desc: 'Included 2: Prominent inclusions affecting durability' },
    { grade: 'I3', desc: 'Included 3: Structural inclusions impacting integrity' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        setImagePreview(loadEvt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFileName(null);
  };

  // Carat slider handler that synchronizes realistic default dimensions
  const handleCaratChange = (caratVal: number) => {
    const factor = Math.cbrt(caratVal / 1.0);
    const newX = parseFloat((6.45 * factor).toFixed(2));
    const newY = parseFloat((6.48 * factor).toFixed(2));
    const newZ = parseFloat((3.98 * factor).toFixed(2));
    setFormData((prev) => ({
      ...prev,
      carat: caratVal,
      x: newX,
      y: newY,
      z: newZ,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        carat: Number(formData.carat),
        cut: formData.cut,
        color: formData.color,
        clarity: formData.clarity,
        depth: Number(formData.depth || 61.5),
        table: Number(formData.table || 57.0),
        x: Number(formData.x),
        y: Number(formData.y),
        z: Number(formData.z),
        shape: formData.shape,
        polish: formData.polish,
        symmetry: formData.symmetry,
        fluorescence: formData.fluorescence,
        diamond_type: formData.diamond_type,
        certification: formData.certification,
        certificate_number: formData.certificate_number || '',
      };

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error (${response.status})`);
      }

      const result = await response.json();
      onPredictionComplete(result);
    } catch (err: any) {
      console.error('Prediction API error:', err);
      setErrorMsg(err.message || 'Failed to connect to DiamondIQ prediction engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Wizard Header & Step Indicator */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-gold-300 text-xs font-semibold text-charcoal-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Multi-Factor Valuation Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-charcoal-900 font-serif">
          Diamond Specification Wizard
        </h2>
        <p className="text-sm text-charcoal-500 mt-2 max-w-xl mx-auto">
          Enter your diamond&apos;s physical and gemological characteristics. Each parameter directly calibrates the underlying Random Forest pricing model.
        </p>

        {/* Step Progression Bar */}
        <div className="mt-8 flex items-center justify-between relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-cream-300 -z-0" />
          {[
            { num: 1, label: 'Identity' },
            { num: 2, label: 'The 4Cs' },
            { num: 3, label: 'Finishing' },
            { num: 4, label: 'Dimensions' },
            { num: 5, label: 'Certificate' },
          ].map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <button
                  onClick={() => setCurrentStep(s.num)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'gold-gradient text-charcoal-900 shadow-gold-glow scale-110'
                      : isDone
                      ? 'bg-charcoal-900 text-white'
                      : 'bg-white border border-cream-400 text-charcoal-400 hover:border-gold-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.num}
                </button>
                <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${isCurrent ? 'text-charcoal-900' : 'text-charcoal-400'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Glass Form Container */}
      <div className="glass-panel p-6 sm:p-10 rounded-luxury-lg shadow-luxury-lg border border-gold-300/40 relative">
        
        {/* Step 1: Basic Diamond Information */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-cream-300 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">1️⃣ Basic Diamond Information</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Define the primary geometry, provenance, and raw weight of the stone.
              </p>
            </div>

            {/* Diamond Origin Selector: Natural vs Lab-Grown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-2">
                Origin & Provenance
              </label>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[
                  { type: 'Natural', desc: 'Geologically mined diamond rough' },
                  { type: 'Lab-Grown', desc: 'HPHT or CVD advanced laboratory synthesis' },
                ].map((orig) => (
                  <button
                    key={orig.type}
                    type="button"
                    onClick={() => setFormData({ ...formData, diamond_type: orig.type as DiamondOrigin })}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.diamond_type === orig.type
                        ? 'border-gold-500 bg-gold-50/50 shadow-sm'
                        : 'border-cream-300 bg-white hover:border-cream-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-charcoal-900">{orig.type}</span>
                      {formData.diamond_type === orig.type && (
                        <CheckCircle2 className="w-4 h-4 text-gold-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-charcoal-500 mt-1">{orig.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Carat Weight Input + Slider */}
            <div className="space-y-3 bg-cream-100 p-5 rounded-xl border border-cream-300">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span>Carat Weight (ct)</span>
                    <span className="text-xs font-normal text-charcoal-400">(1 carat = 0.200 grams)</span>
                  </label>
                  <p className="text-xs text-charcoal-500">Weight exponential driver of market valuation.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.2"
                    max="5.0"
                    value={formData.carat}
                    onChange={(e) => handleCaratChange(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-24 px-3 py-1.5 bg-white border border-gold-400 rounded-lg text-charcoal-900 text-right font-bold text-base focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                  <span className="text-sm font-semibold text-charcoal-600">ct</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0.2"
                max="3.5"
                step="0.01"
                value={formData.carat}
                onChange={(e) => handleCaratChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-cream-300 rounded-lg appearance-none cursor-pointer"
              />

              {/* Quick Carat Preset Chips */}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <span className="text-xs text-charcoal-400 font-medium">Quick Presets:</span>
                {[0.5, 0.7, 1.0, 1.25, 1.5, 2.0, 2.5].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleCaratChange(preset)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
                      formData.carat === preset
                        ? 'bg-charcoal-900 text-gold-400 border-charcoal-900'
                        : 'bg-white border-cream-300 text-charcoal-600 hover:bg-cream-200'
                    }`}
                  >
                    {preset.toFixed(2)} ct
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-3">
                Diamond Shape (Geometry)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {shapes.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, shape: s.name })}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      formData.shape === s.name
                        ? 'border-gold-500 bg-gold-50/60 shadow-sm scale-105'
                        : 'border-cream-300 bg-white hover:border-cream-400 hover:bg-cream-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center text-charcoal-700 font-serif font-bold text-xs">
                      {s.name[0]}
                    </div>
                    <span className="text-xs font-bold text-charcoal-900">{s.name}</span>
                    <span className="text-[10px] text-charcoal-400 leading-tight line-clamp-1">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: The 4Cs */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-cream-300 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">2️⃣ The 4Cs (Cut, Color, Clarity, Carat)</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                The internationally standardized universal framework for gemological diamond grading.
              </p>
            </div>

            {/* Cut Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5">
                  <span>Cut Quality Grade</span>
                  <span className="text-gold-600 text-[10px] font-semibold">(Greatest influence on sparkle)</span>
                </label>
                <span className="text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-0.5 rounded-full">
                  Selected: {formData.cut}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {cuts.map((c) => (
                  <button
                    key={c.grade}
                    type="button"
                    onClick={() => setFormData({ ...formData, cut: c.grade })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.cut === c.grade
                        ? 'border-gold-500 bg-gold-50/70 shadow-sm'
                        : 'border-cream-300 bg-white hover:border-cream-400'
                    }`}
                  >
                    <div className="font-bold text-xs text-charcoal-900">{c.grade}</div>
                    <p className="text-[10px] text-charcoal-500 mt-1 leading-snug">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Grade */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5">
                  <span>Color Grade (D - M Spectrum)</span>
                  <span className="text-charcoal-400 text-[10px]">D is completely colorless</span>
                </label>
                <span className="text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-0.5 rounded-full">
                  Selected: Grade {formData.color}
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                {colors.map((col) => (
                  <button
                    key={col.grade}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: col.grade })}
                    className={`py-2 px-1 rounded-lg border text-center transition-all ${
                      formData.color === col.grade
                        ? 'border-gold-500 bg-gold-500 text-white font-bold shadow-sm'
                        : 'border-cream-300 bg-white text-charcoal-700 hover:border-cream-400 hover:bg-cream-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{col.grade}</div>
                    <div className="text-[9px] opacity-80">{col.tier.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-charcoal-400 italic">
                Grades D–F are strictly colorless; G–J represent near-colorless stones offering superior balance of fire and price.
              </p>
            </div>

            {/* Clarity Grade */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5">
                  <span>Clarity Grade (FL to I3)</span>
                  <span className="text-charcoal-400 text-[10px]">Microscopic internal purity under 10x</span>
                </label>
                <span className="text-xs font-bold text-gold-700 bg-gold-100 px-2.5 py-0.5 rounded-full">
                  Selected: {formData.clarity}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {clarities.slice(0, 8).map((cl) => (
                  <button
                    key={cl.grade}
                    type="button"
                    onClick={() => setFormData({ ...formData, clarity: cl.grade })}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      formData.clarity === cl.grade
                        ? 'border-gold-500 bg-gold-50/70 shadow-sm'
                        : 'border-cream-300 bg-white hover:border-cream-400'
                    }`}
                  >
                    <span className="text-xs font-bold text-charcoal-900">{cl.grade}</span>
                    <p className="text-[9px] text-charcoal-400 line-clamp-1 mt-0.5">{cl.desc.split(':')[0]}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Step 3: Finishing & Quality */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-cream-300 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">3️⃣ Finishing & Quality Details</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Surface polish, facet symmetry alignment, and UV light fluorescence characteristics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Polish */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center justify-between">
                  <span>Surface Polish</span>
                  <span className="text-charcoal-400 text-[11px] lowercase">smoothness of facet glass</span>
                </label>
                <select
                  value={formData.polish}
                  onChange={(e) => setFormData({ ...formData, polish: e.target.value as PolishGrade })}
                  className="w-full bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal-800 focus:ring-1 focus:ring-gold-500 outline-none"
                >
                  {['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <p className="text-[11px] text-charcoal-400">
                  Excellent polish eliminates micro-burn marks or polishing wheel wheel lines.
                </p>
              </div>

              {/* Symmetry */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center justify-between">
                  <span>Facet Symmetry</span>
                  <span className="text-charcoal-400 text-[11px] lowercase">geometric alignment</span>
                </label>
                <select
                  value={formData.symmetry}
                  onChange={(e) => setFormData({ ...formData, symmetry: e.target.value as SymmetryGrade })}
                  className="w-full bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm font-medium text-charcoal-800 focus:ring-1 focus:ring-gold-500 outline-none"
                >
                  {['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <p className="text-[11px] text-charcoal-400">
                  Precise symmetry yields the coveted &quot;Hearts and Arrows&quot; optical pattern.
                </p>
              </div>
            </div>

            {/* Fluorescence */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center justify-between">
                <span>UV Fluorescence</span>
                <span className="text-charcoal-400 text-[11px]">Glow response under blacklight</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {['None', 'Faint', 'Medium', 'Strong', 'Very Strong'].map((fl) => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setFormData({ ...formData, fluorescence: fl as FluorescenceGrade })}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      formData.fluorescence === fl
                        ? 'border-gold-500 bg-gold-50 font-bold text-charcoal-900 shadow-sm'
                        : 'border-cream-300 bg-white text-charcoal-600 hover:border-cream-400'
                    }`}
                  >
                    <span className="text-xs">{fl}</span>
                  </button>
                ))}
              </div>
              <div className="bg-diamond-50 border border-diamond-200 p-3 rounded-xl flex items-start gap-2 text-xs text-charcoal-600">
                <Info className="w-4 h-4 text-diamond-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Market Note:</strong> In top color grades (D–F), strong fluorescence may trade at a 3–8% discount. Conversely, in I–J color diamonds, medium blue fluorescence can counteract yellow tints in natural sunlight.
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Step 4: Measurements & Proportions */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-cream-300 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">4️⃣ Physical Dimensions & Proportions</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Precision caliper millimeters, table percentage, and automated spatial volume calculation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Length x */}
              <div className="bg-white p-4 rounded-xl border border-cream-300">
                <label className="text-xs font-bold text-charcoal-600 uppercase">Length (x)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.x}
                    onChange={(e) => setFormData({ ...formData, x: parseFloat(e.target.value) || 0 })}
                    className="w-full text-base font-bold text-charcoal-900 outline-none"
                  />
                  <span className="text-xs text-charcoal-400 font-semibold">mm</span>
                </div>
              </div>

              {/* Width y */}
              <div className="bg-white p-4 rounded-xl border border-cream-300">
                <label className="text-xs font-bold text-charcoal-600 uppercase">Width (y)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.y}
                    onChange={(e) => setFormData({ ...formData, y: parseFloat(e.target.value) || 0 })}
                    className="w-full text-base font-bold text-charcoal-900 outline-none"
                  />
                  <span className="text-xs text-charcoal-400 font-semibold">mm</span>
                </div>
              </div>

              {/* Depth z */}
              <div className="bg-white p-4 rounded-xl border border-cream-300">
                <label className="text-xs font-bold text-charcoal-600 uppercase">Depth (z)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    step="0.01"
                    value={formData.z}
                    onChange={(e) => setFormData({ ...formData, z: parseFloat(e.target.value) || 0 })}
                    className="w-full text-base font-bold text-charcoal-900 outline-none"
                  />
                  <span className="text-xs text-charcoal-400 font-semibold">mm</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Depth % */}
              <div className="bg-white p-4 rounded-xl border border-cream-300">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-charcoal-600 uppercase">Depth Percentage</label>
                  <span className="text-xs text-charcoal-400">Ideal: 59.5% – 62.9%</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: parseFloat(e.target.value) || 0 })}
                    className="w-full text-base font-bold text-charcoal-900 outline-none"
                  />
                  <span className="text-xs text-charcoal-400 font-semibold">%</span>
                </div>
              </div>

              {/* Table % */}
              <div className="bg-white p-4 rounded-xl border border-cream-300">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-charcoal-600 uppercase">Table Percentage</label>
                  <span className="text-xs text-charcoal-400">Ideal: 54.0% – 60.0%</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.table}
                    onChange={(e) => setFormData({ ...formData, table: parseFloat(e.target.value) || 0 })}
                    className="w-full text-base font-bold text-charcoal-900 outline-none"
                  />
                  <span className="text-xs text-charcoal-400 font-semibold">%</span>
                </div>
              </div>
            </div>

            {/* Live Engineered Volume Pill */}
            <div className="bg-cream-100 p-4 rounded-xl border border-cream-300 flex items-center justify-between">
              <div>
                <span className="text-xs text-charcoal-400 uppercase font-semibold">Live Engineered Feature</span>
                <p className="text-sm font-bold text-charcoal-800">
                  Calculated Spatial Volume (x × y × z): <span className="text-gold-700">{liveVolume} mm³</span>
                </p>
              </div>
              <span className="text-xs bg-gold-200 text-gold-800 font-bold px-3 py-1 rounded-full">
                Auto-Derived
              </span>
            </div>

            {/* Proportion Diagram Component */}
            <div className="border border-cream-300 p-5 rounded-xl bg-white text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">Faceted Proportion Blueprint</span>
              <div className="py-4 flex justify-center">
                <div className="relative w-64 h-32 border-b-2 border-charcoal-800 flex items-center justify-center">
                  {/* Visual crown trapezoid */}
                  <div className="absolute top-0 w-36 h-10 border-t-2 border-r-2 border-l-2 border-gold-600 bg-gold-50/50 flex items-center justify-center text-[10px] font-bold text-gold-800">
                    Table: {formData.table}%
                  </div>
                  {/* Pavilion triangle */}
                  <div className="absolute bottom-0 w-0 h-0 border-l-[64px] border-l-transparent border-r-[64px] border-r-transparent border-t-[60px] border-t-charcoal-300/40" />
                  <span className="absolute bottom-2 text-[10px] font-bold text-charcoal-500">
                    Total Depth: {formData.depth}%
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step 5: Certification & Image Upload */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-cream-300 pb-4">
              <h3 className="text-xl font-bold text-charcoal-900 font-serif">5️⃣ Certification & Image Upload</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Gemological laboratory certificate number and high-resolution stone photography.
              </p>
            </div>

            {/* Lab Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Grading Laboratory
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                {['GIA', 'IGI', 'HRD', 'AGS', 'Other', 'No Certificate'].map((lab) => (
                  <button
                    key={lab}
                    type="button"
                    onClick={() => setFormData({ ...formData, certification: lab as CertificationLab })}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      formData.certification === lab
                        ? 'border-gold-500 bg-gold-50 font-bold text-charcoal-900 shadow-sm'
                        : 'border-cream-300 bg-white text-charcoal-600 hover:border-cream-400'
                    }`}
                  >
                    <span className="text-xs">{lab}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Certificate Serial Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                Certificate Identification Serial Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 2235918234"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                  className="w-full bg-white border border-cream-300 rounded-xl px-4 py-3 text-sm text-charcoal-900 font-medium focus:ring-1 focus:ring-gold-500 outline-none"
                />
                <div className="flex items-center gap-1.5 px-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex-shrink-0">
                  <Shield className="w-4 h-4" />
                  <span>Demo Verified</span>
                </div>
              </div>
              <p className="text-[11px] text-charcoal-400">
                <strong>Disclaimer:</strong> Certificate verification is simulated for prototype demonstration.
              </p>
            </div>

            {/* Diamond Image Upload */}
            <div className="space-y-3 pt-4 border-t border-cream-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-charcoal-700">
                  Diamond Specimen Photography
                </label>
                <span className="text-[10px] font-bold bg-diamond-100 text-diamond-700 border border-diamond-300 px-2.5 py-0.5 rounded-full">
                  Image analysis — Coming soon
                </span>
              </div>

              {!imagePreview ? (
                <label className="border-2 border-dashed border-cream-400 hover:border-gold-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors">
                  <Upload className="w-8 h-8 text-gold-600 mb-2" />
                  <span className="text-xs font-bold text-charcoal-800">Click or drag diamond image here</span>
                  <span className="text-[11px] text-charcoal-400 mt-1">PNG, JPG, or WEBP up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative border border-cream-300 rounded-2xl p-4 bg-white flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Diamond Preview"
                    className="w-20 h-20 object-cover rounded-xl border border-cream-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-charcoal-900 truncate">{imageFileName}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Uploaded & Attached to Specimen</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 rounded-lg text-charcoal-400 hover:text-red-500 hover:bg-cream-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="mt-8 pt-6 border-t border-cream-300 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal-700 font-semibold text-xs hover:bg-cream-100 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 rounded-xl bg-charcoal-900 text-white font-semibold text-xs hover:bg-charcoal-800 flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="gold-gradient text-charcoal-900 font-bold px-8 py-3.5 rounded-xl shadow-luxury-lg hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5 text-sm"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Evaluating Model Inferences...' : 'Estimate Diamond Value'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
