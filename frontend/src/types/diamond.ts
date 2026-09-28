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
