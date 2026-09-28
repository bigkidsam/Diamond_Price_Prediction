import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PredictorWizard } from './components/PredictorWizard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { QuickCalculator } from './components/QuickCalculator';
import { CompareDiamonds } from './components/CompareDiamonds';
import { DiamondGuide } from './components/DiamondGuide';
import { MarketInsights } from './components/MarketInsights';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ValuationReportModal } from './components/ValuationReportModal';
import { Footer } from './components/Footer';
import { PredictionResult, SavedDiamond } from './types/diamond';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currency, setCurrency] = useState<string>('USD');
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]);
  const [savedDiamonds, setSavedDiamonds] = useState<SavedDiamond[]>([]);
  const [comparisonList, setComparisonList] = useState<PredictionResult[]>([]);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // Load history & saved diamonds from backend or localStorage on mount
  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPredictionHistory(data);
      })
      .catch((err) => console.log('Notice: Running with client session memory:', err));

    const localSaved = localStorage.getItem('diamond_iq_saved');
    if (localSaved) {
      try {
        setSavedDiamonds(JSON.parse(localSaved));
      } catch {}
    }
  }, []);

  const handlePredictionComplete = (result: PredictionResult) => {
    setLatestPrediction(result);
    setPredictionHistory((prev) => [result, ...prev]);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveToDashboard = (pred: PredictionResult) => {
    const newSaved: SavedDiamond = {
      ...pred,
      saved_at: new Date().toISOString(),
    };
    const updated = [newSaved, ...savedDiamonds.filter((d) => d.id !== pred.id)];
    setSavedDiamonds(updated);
    localStorage.setItem('diamond_iq_saved', JSON.stringify(updated));

    // Also notify backend
    fetch('/api/save-prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSaved),
    }).catch(() => {});
  };

  const handleRemoveSaved = (id: string) => {
    const updated = savedDiamonds.filter((d) => d.id !== id);
    setSavedDiamonds(updated);
    localStorage.setItem('diamond_iq_saved', JSON.stringify(updated));
  };

  const handleAddToCompare = (pred: PredictionResult) => {
    if (comparisonList.some((item) => item.id === pred.id)) return;
    if (comparisonList.length >= 3) {
      setComparisonList([comparisonList[1], comparisonList[2], pred]);
    } else {
      setComparisonList([...comparisonList, pred]);
    }
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFromCompare = (id: string) => {
    setComparisonList(comparisonList.filter((item) => item.id !== id));
  };

  const handleSelectPredictionFromHistory = (pred: any) => {
    setLatestPrediction(pred);
    setActiveTab('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-800 selection:bg-gold-500 selection:text-white">
      {/* Sticky Luxury Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenPredictor={() => {
          setActiveTab('predictor');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection
              onStartPrediction={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreGuide={() => {
                setActiveTab('guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Embedded Quick Calculator on Homepage */}
            <div className="border-t border-cream-300/80 bg-cream-50/50 py-12">
              <QuickCalculator
                currency={currency}
                onNavigateToFullPredictor={() => {
                  setActiveTab('predictor');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'predictor' && (
          <div className="py-6">
            <PredictorWizard
              onPredictionComplete={handlePredictionComplete}
              currency={currency}
            />
          </div>
        )}

        {activeTab === 'results' && latestPrediction && (
          <div className="py-6">
            <ResultsDashboard
              prediction={latestPrediction}
              currency={currency}
              onModifyDetails={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenReportModal={() => setReportModalOpen(true)}
              onAddToCompare={handleAddToCompare}
              onSaveToDashboard={handleSaveToDashboard}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="py-6">
            <QuickCalculator
              currency={currency}
              onNavigateToFullPredictor={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="py-6">
            <CompareDiamonds
              comparisonList={comparisonList}
              onRemoveFromCompare={handleRemoveFromCompare}
              currency={currency}
              onOpenPredictor={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="py-6">
            <DiamondGuide />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="py-6">
            <MarketInsights currency={currency} />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="py-6">
            <UserDashboard
              savedDiamonds={savedDiamonds}
              predictionHistory={predictionHistory}
              onSelectPrediction={handleSelectPredictionFromHistory}
              onRemoveSaved={handleRemoveSaved}
              currency={currency}
              onOpenPredictor={() => {
                setActiveTab('predictor');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="py-6">
            <AdminDashboard predictionHistory={predictionHistory} />
          </div>
        )}
      </main>

      {/* Printable Valuation Report Modal */}
      {reportModalOpen && latestPrediction && (
        <ValuationReportModal
          prediction={latestPrediction}
          currency={currency}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
