import React, { useState } from 'react';
import { Gem, Menu, X, Sparkles, Sliders, BookOpen, BarChart3, GitCompare, LayoutDashboard, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  onOpenPredictor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenPredictor,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'predictor', label: 'Price Predictor', icon: Sparkles },
    { id: 'calculator', label: 'Quick Calc', icon: Sliders },
    { id: 'guide', label: 'Diamond Guide', icon: BookOpen },
    { id: 'insights', label: 'Market Insights', icon: BarChart3 },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'dashboard', label: 'User Dashboard', icon: LayoutDashboard },
    { id: 'admin', label: 'Admin Telemetry', icon: ShieldCheck },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cream-300 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl gold-gradient flex items-center justify-center shadow-gold-glow group-hover:scale-105 transition-transform duration-300">
              <Gem className="w-6 h-6 text-charcoal-900" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold tracking-tight text-charcoal-900 font-serif">
                  Diamond<span className="gold-text-gradient">IQ</span>
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-charcoal-400 font-semibold">
                AI Valuation Terminal
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-charcoal-900 text-gold-400 shadow-sm'
                      : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-charcoal-400'}`} />
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-cream-200 border border-cream-300 text-charcoal-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>

            {/* Primary CTA */}
            <button
              onClick={onOpenPredictor}
              className="gold-gradient text-charcoal-900 font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md hover:shadow-gold-glow hover:brightness-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Predict Value</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-cream-300 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-charcoal-900 text-gold-400'
                    : 'text-charcoal-700 hover:bg-cream-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-cream-200 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-charcoal-500 font-medium">Currency Display:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-cream-200 border border-cream-300 text-charcoal-700 text-xs font-semibold rounded-lg px-3 py-1.5"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <button
              onClick={() => {
                onOpenPredictor();
                setMobileMenuOpen(false);
              }}
              className="w-full gold-gradient text-charcoal-900 font-semibold py-3 rounded-xl text-center shadow-md text-sm"
            >
              Predict Diamond Price
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
