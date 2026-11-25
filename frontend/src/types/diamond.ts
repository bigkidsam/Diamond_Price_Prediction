export type DiamondShape =
  | 'Round'
  | 'Princess'
  | 'Cushion'
  | 'Oval'
  | 'Emerald'
  | 'Pear'
  | 'Marquise'
  | 'Radiant'
  | 'Asscher'
  | 'Heart';

export type CutQuality = 'Ideal' | 'Premium' | 'Very Good' | 'Good' | 'Fair';
export type ColorGrade = 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M';
export type ClarityGrade = 'FL' | 'IF' | 'VVS1' | 'VVS2' | 'VS1' | 'VS2' | 'SI1' | 'SI2' | 'I1' | 'I2' | 'I3';
export type PolishGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
export type SymmetryGrade = 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
export type FluorescenceGrade = 'None' | 'Faint' | 'Medium' | 'Strong' | 'Very Strong';
export type DiamondOrigin = 'Natural' | 'Lab-Grown';
export type CertificationLab = 'GIA' | 'IGI' | 'HRD' | 'AGS' | 'Other' | 'No Certificate';

export interface DiamondInput {
  carat: number;
  cut: CutQuality;
  color: ColorGrade;
  clarity: ClarityGrade;
  depth: number;
  table: number;
  x: number;
  y: number;
  z: number;
  shape: DiamondShape;
  polish: PolishGrade;
  symmetry: SymmetryGrade;
  fluorescence: FluorescenceGrade;
  diamond_type: DiamondOrigin;
  certification: CertificationLab;
  certificate_number?: string;
  image_url?: string;
}

export interface FeatureContribution {
  feature: string;
  impact_percentage: number;
  description: string;
}

export interface MarketRange {
  low: number;
  typical_min: number;
  estimate: number;
  typical_max: number;
  high: number;
}

export interface PredictionResult {
  id: string;
  estimated_price: number;
  lower_bound: number;
  upper_bound: number;
  price_per_carat: number;
  confidence: string;
  disclaimer: string;
  model_version: string;
  prediction_date: string;
  currency: string;
  diamond_profile: DiamondInput;
  feature_contributions: FeatureContribution[];
  explanations: string[];
  market_range: MarketRange;
}

export interface SavedDiamond extends PredictionResult {
  nickname?: string;
  saved_at: string;
}

export interface MarketInsightsData {
  summary: {
    average_price: number;
    average_carat: number;
    popular_shape: string;
    popular_carat_range: string;
    annual_price_change: string;
    natural_index_movement: string;
    lab_grown_price_movement: string;
  };
  shape_distribution: Array<{
    shape: string;
    market_share: number;
    avg_price: number;
  }>;
  price_by_carat: Array<{
    carat: string;
    avg_price: number;
    price_per_carat: number;
  }>;
  historical_trends: {
    periods: string[];
    natural_trend: number[];
    lab_grown_trend: number[];
  };
  data_source_note: string;
}

export interface ModelMetrics {
  version: string;
  algorithm: string;
  n_estimators: number;
  training_dataset_size: number;
  r2_score: number;
  rmse: number;
  mae: number;
  status: string;
  training_date: string;
  features_used: string[];
}

export interface TournamentModel {
  model: string;
  r2: number;
  rmse: number;
  mae: number;
  mape_pct: number;
  train_time_sec: number;
  latency_ms_per_sample: number;
}

export interface TournamentData {
  status: string;
  champion_model: string;
  benchmark_dataset_size: number;
  leaderboard: TournamentModel[];
}

export interface ShapContribution {
  feature: string;
  impact_usd: number;
  direction: 'positive' | 'negative';
}

export interface ShapExplanationResult {
  status: string;
  explainer: string;
  base_market_price: number;
  predicted_price: number;
  top_feature_contributions: ShapContribution[];
  category_breakdown: {
    carat_and_volume: number;
    clarity: number;
    color: number;
    cut_and_proportions: number;
    other_geometry: number;
  };
}

export interface ForecastTrajectoryPoint {
  year: number;
  projected_price: number;
  lower_confidence_bound: number;
  upper_confidence_bound: number;
  cumulative_change_pct: number;
}

export interface ForecastResult {
  status: string;
  model: string;
  diamond_type: string;
  current_valuation: number;
  forecast_horizon_years: number;
  annualized_rate_pct: number;
  macro_drivers: {
    gold_1y_return?: number;
    usd_1y_return?: number;
    status?: string;
  };
  projected_trajectory: ForecastTrajectoryPoint[];
}

export interface ConformalPredictionResult {
  methodology: string;
  confidence_level: string;
  point_estimate: number;
  lower_bound: number;
  upper_bound: number;
  margin_error_usd: number;
  statistical_guarantee: string;
  calibration_samples: number;
}
