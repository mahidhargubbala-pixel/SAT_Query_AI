import React from "react";
import { NavPage } from "../types";
import { SatelliteHero3D } from "./SatelliteHero3D";
import {
  Compass,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  ScanLine,
  Database,
  Radio,
  FileText,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: NavPage) => void;
  onSelectModeAndLaunch: (mode: "single" | "bitemporal" | "optical_sar") => void;
}

export function LandingPage({ onNavigate, onSelectModeAndLaunch }: LandingPageProps) {
  return (
    <div className="flex flex-col w-full pb-20 overflow-hidden">
      {/* 1. HERO SECTION WITH 3D SATELLITE SIMULATION */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Vision & Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* SIH Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>SMART INDIA HACKATHON SOLUTION</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
              SATQUERY AI
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500 text-2xl sm:text-3xl lg:text-4xl mt-2 font-extrabold tracking-normal">
                “Ask. Analyze. Understand Earth.”
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mb-8">
              An interactive vision-language assistant for multimodal remote sensing image analysis through text queries.
              Seamlessly analyze single satellite rasters, compare bi-temporal before/after changes side-by-side, and fuse optical with synthetic aperture radar (SAR).
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onNavigate("workspace")}
                className="px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-sky-600/30 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Compass className="w-5 h-5" />
                <span>Launch Analysis Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate("models")}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Model Registry & PEFT</span>
              </button>
            </div>

            {/* Key Specs Bar */}
            <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-800 w-full max-w-lg font-mono">
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">10m GSD</div>
                <div className="text-[11px] text-slate-400 font-sans">Sentinel-2 Optical</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-sky-400">C-Band</div>
                <div className="text-[11px] text-slate-400 font-sans">Sentinel-1 SAR Radar</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">92.4%</div>
                <div className="text-[11px] text-slate-400 font-sans">VRSBench / CDVQA</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Satellite Hero */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div className="relative w-full rounded-3xl bg-slate-950/60 border border-slate-800/80 shadow-2xl p-2 backdrop-blur-md overflow-hidden">
              <SatelliteHero3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE PRIMARY MULTIMODAL ANALYSIS MODES */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest mb-2">
            CORE ANALYSIS CAPABILITIES
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Multimodal Remote Sensing Modalities
          </h3>
          <p className="text-slate-400 text-sm mt-2">
            Select a mode to jump straight into the specialized workspace pipeline with pre-configured models and rasters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Single Image VQA */}
          <div
            onClick={() => onSelectModeAndLaunch("single")}
            className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl hover:border-sky-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                <ScanLine className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Single Image VQA & Grounding
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Natural-language question answering, scene captioning, and automated visual grounding with localized bounding boxes on Sentinel-2 multispectral rasters.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-sky-400 font-semibold">
              <span>SatQuery-VQA-Pro</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Single <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Bi-Temporal Change Detection (The user's key highlight) */}
          <div
            onClick={() => onSelectModeAndLaunch("bitemporal")}
            className="group relative rounded-3xl bg-slate-900/90 border-2 border-sky-500/40 p-6 shadow-2xl hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
              POPULAR
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Bi-Temporal Change Detection
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Before (T1) and After (T2) side-by-side prompt comparison. Identifies urban growth, deforestation, or land reclamation with marked changes directly on the raster.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold">
              <span>SatQuery-BiTempDiff-v3.2</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Compare T1 vs T2 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Optical + SAR Cross-Modal Fusion */}
          <div
            onClick={() => onSelectModeAndLaunch("optical_sar")}
            className="group relative rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl hover:border-sky-500/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Optical + SAR Cross-Modal
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                All-weather Sentinel-1 C-band radar backscatter penetrates cloud cover to reveal structures and water bodies, fused seamlessly with Sentinel-2 optical imagery.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
              <span>CrossModal-SAR-OptFusion</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Fuse Sensors <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SYSTEM ARCHITECTURE & AGENTIC WORKFLOW */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-3xl bg-slate-900/95 border border-slate-800 p-6 sm:p-10 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest mb-2">
              SATQUERY AI SYSTEM ARCHITECTURE
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              The SIH Agentic Multimodal Pipeline
            </h3>
            <p className="text-slate-400 text-sm mt-2">
              End-to-end autonomous routing from raw geospatial rasters to verified intelligence evidence.
            </p>
          </div>

          {/* Workflow Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {[
              {
                step: "01",
                title: "Upload & Ingest",
                desc: "Validates GeoTIFF, CRS, GSD, and spectral bands",
              },
              {
                step: "02",
                title: "Query Parsing",
                desc: "Extracts user intent & spatial constraints",
              },
              {
                step: "03",
                title: "Agentic Router",
                desc: "Selects specialized PEFT model & adapter",
              },
              {
                step: "04",
                title: "Execution Engine",
                desc: "Multimodal feature extraction & reasoning",
              },
              {
                step: "05",
                title: "Visual Evidence",
                desc: "Marked bounding boxes & change contours",
              },
              {
                step: "06",
                title: "Database Sync",
                desc: "Committed to PostgreSQL history & dossiers",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-sky-400">
                    STEP {item.step}
                  </span>
                  <div className="text-sm font-bold text-white mt-1 mb-1">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-900 flex items-center text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  <span>Automated</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
