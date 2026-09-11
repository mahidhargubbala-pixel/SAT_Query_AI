export type AnalysisMode = "single" | "bitemporal" | "optical_sar";

export type NavPage = "home" | "workspace" | "dashboard" | "history" | "reports" | "models" | "settings";

export type CursorThemeId = "azure-fluid" | "solar-gold" | "aurora-emerald" | "quantum-violet";

export interface CursorTheme {
  id: CursorThemeId;
  name: string;
  tag: string;
  primaryColor: string;
  glowColor: string;
  dotColor: string;
  description: string;
}

export type LogoVariantId =
  | "orbital-radar"
  | "hex-sensor"
  | "quantum-horizon"
  | "prism-band"
  | "sar-phased"
  | "tri-constellation";

export interface LogoVariant {
  id: LogoVariantId;
  name: string;
  subtitle: string;
  description: string;
}

export interface BoundingBox {
  id: string;
  label: string;
  category: "built_up" | "water" | "vegetation" | "deforestation" | "infrastructure";
  color: string;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages (0-100)
  confidence: number;
  areaKm2?: number;
  changeType?: "new_construction" | "vegetation_loss" | "water_expansion" | "none";
}

export interface SatelliteScene {
  id: string;
  title: string;
  subtitle: string;
  mode: AnalysisMode;
  location: string;
  coordinates: string;
  crs: string;
  gsd: string;
  sensor: string;
  bands: string[];
  // Single mode image
  image?: string;
  // Bi-temporal mode images
  imageT1?: string;
  imageT2?: string;
  timestampT1?: string;
  timestampT2?: string;
  // Optical + SAR mode images
  imageOptical?: string;
  imageSAR?: string;
  // Suggested example queries
  exampleQueries: string[];
  defaultBoxes?: BoundingBox[];
  defaultChangePercentage?: number;
}

export interface AnalysisRecord {
  id: string;
  createdAt: string;
  query: string;
  mode: AnalysisMode;
  sceneId: string;
  sceneTitle: string;
  taskType: string;
  modelsUsed: string[];
  answer: string;
  confidence: {
    level: "High" | "Medium" | "Low";
    score: number;
    metric: string;
  };
  evidence: {
    boundingBoxes?: BoundingBox[];
    changePercentage?: number;
    keyObservations: string[];
    changeVectorSummary?: string;
    crossModalInsight?: string;
  };
  executionSummary: string[];
  technicalDetails: {
    crs: string;
    gsd: string;
    bands: string[];
    sensor: string;
    coordinates: string;
    adapter: string;
    latencyMs: number;
  };
  isSaved?: boolean;
}

export interface ReportRecord {
  id: string;
  title: string;
  analysisId: string;
  createdAt: string;
  analyst: string;
  summary: string;
  query: string;
  mode: string;
  status: "Finalized" | "Draft";
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  primaryMission: string;
  avatarIcon: string;
  clearanceLevel: "Level-1 Public" | "Level-2A BOA Multi-Spectral" | "Level-3 SAR Fusion & Defence";
  createdAt: string;
  bio?: string;
  location?: string;
  analysesCount?: number;
}
