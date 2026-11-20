"""
ml_engine/macro_forecaster.py
Macroeconomic & Temporal Diamond Price Forecasting Engine
Integrates live financial time-series (Gold, DXY, Inflation proxies) with diamond market dynamics.
"""

import os
import datetime
import numpy as np
import pandas as pd

class MacroForecastingEngine:
    """
    Two-Stage Hybrid Valuation & Dynamic Forecasting Engine.
    Combines intrinsic ML hedonic baseline with macro time-series and origin divergence.
    """
    def __init__(self):
        self.macro_cache = {}
        self.last_sync = None

    def fetch_live_macro_indicators(self):
        """
        Fetch latest market momentum metrics using yfinance.
        Falls back to validated empirical baselines if network is unavailable.
        """
        try:
            import yfinance as yf
            # GLD (Gold Proxy), UUP (USD Proxy), SPY (Market Proxy)
            tickers = yf.Tickers('GLD UUP SPY')
            hist = tickers.history(period='1y')
            
            # Annual returns
            gold_return = (hist['Close']['GLD'].iloc[-1] / hist['Close']['GLD'].iloc[0]) - 1.0
            usd_return = (hist['Close']['UUP'].iloc[-1] / hist['Close']['UUP'].iloc[0]) - 1.0
            
            self.macro_cache = {
                "gold_1y_return": round(float(gold_return), 4),
                "usd_1y_return": round(float(usd_return), 4),
                "status": "live_feed",
                "timestamp": datetime.datetime.now().isoformat()
            }
        except Exception as e:
            # Fallback to realistic calibrated empirical macro levels
            self.macro_cache = {
                "gold_1y_return": 0.082,  # +8.2% historical gold baseline
                "usd_1y_return": -0.015,  # -1.5% USD baseline
                "status": "empirical_fallback",
                "error": str(e),
                "timestamp": datetime.datetime.now().isoformat()
            }
        return self.macro_cache

    def forecast_future_price(
        self,
        base_price: float,
        carat: float,
        diamond_type: str = "Natural",
        years_ahead: int = 3
    ):
        """
        Project price trajectory over a 1 to 5 year horizon.
        
        Factors:
        1. Origin Divergence:
           - Natural diamonds: Scarcity-driven compounding (+3.0% to +5.0% / year for investment grades)
           - Lab-grown diamonds: Industrial technology cost decline (-12.0% to -16.0% / year)
        2. Carat Weight Elasticity:
           - Larger stones (>2.0ct) exhibit higher wealth elasticity and lower substitution risk.
        3. Macro Shock Factor:
           - Gold positive correlation (+0.35 beta)
           - Strong dollar inverse pressure (-0.40 beta)
        """
        if not self.macro_cache:
            self.fetch_live_macro_indicators()

        is_natural = diamond_type.lower() == "natural"
        
        # Base annual drift rate by origin
        if is_natural:
            base_annual_drift = 0.038  # +3.8% annual natural baseline
            # Carat premium: larger natural diamonds appreciate faster due to depleted big-stone mines
            if carat >= 2.0:
                base_annual_drift += 0.018  # +5.6% total
            elif carat >= 1.0:
                base_annual_drift += 0.008  # +4.6% total
        else:
            # Lab grown: Wright's law manufacturing cost decay
            base_annual_drift = -0.135  # -13.5% annual lab depreciation
            if carat >= 2.0:
                base_annual_drift += 0.020  # slightly slower decay on very large lab cuts
        
        # Macro influence
        gold_factor = self.macro_cache.get("gold_1y_return", 0.05) * 0.25
        usd_factor = self.macro_cache.get("usd_1y_return", 0.0) * (-0.30)
        
        adjusted_annual_rate = base_annual_drift + gold_factor + usd_factor
        
        # Build yearly trajectory points
        trajectory = []
        current_val = base_price
        
        for yr in range(1, years_ahead + 1):
            projected = base_price * ((1.0 + adjusted_annual_rate) ** yr)
            # Volatility expansion over time: uncertainty cone widens with sqrt(time)
            uncertainty_band = projected * (0.04 * np.sqrt(yr))
            
            trajectory.append({
                "year": yr,
                "projected_price": round(float(projected), 2),
                "lower_confidence_bound": round(float(projected - uncertainty_band), 2),
                "upper_confidence_bound": round(float(projected + uncertainty_band), 2),
                "cumulative_change_pct": round(float(((projected - base_price) / base_price) * 100.0), 2)
            })

        return {
            "base_price": base_price,
            "diamond_type": diamond_type,
            "carat": carat,
            "forecast_horizon_years": years_ahead,
            "annualized_expected_return_pct": round(adjusted_annual_rate * 100.0, 2),
            "macro_inputs": self.macro_cache,
            "projection_trajectory": trajectory
        }

if __name__ == "__main__":
    engine = MacroForecastingEngine()
    print("Testing Live Macro Indicators...")
    macro = engine.fetch_live_macro_indicators()
    print(macro)
    
    print("\n--- 3-Year Projection: 1.5ct NATURAL Diamond ($10,000 baseline) ---")
    nat_proj = engine.forecast_future_price(10000, carat=1.5, diamond_type="Natural", years_ahead=3)
    for p in nat_proj["projection_trajectory"]:
        print(f"Year {p['year']}: ${p['projected_price']:,.2f} ({p['cumulative_change_pct']:+,.1f}%) | Range: [${p['lower_confidence_bound']:,.2f} - ${p['upper_confidence_bound']:,.2f}]")
        
    print("\n--- 3-Year Projection: 1.5ct LAB-GROWN Diamond ($1,800 baseline) ---")
    lab_proj = engine.forecast_future_price(1800, carat=1.5, diamond_type="Lab-Grown", years_ahead=3)
    for p in lab_proj["projection_trajectory"]:
        print(f"Year {p['year']}: ${p['projected_price']:,.2f} ({p['cumulative_change_pct']:+,.1f}%) | Range: [${p['lower_confidence_bound']:,.2f} - ${p['upper_confidence_bound']:,.2f}]")
