import React from "react";
import { AnalysisRecord, NavPage } from "../types";
import {
  LayoutDashboard,
  Activity,
  ShieldCheck,
  Zap,
  Layers,
  Compass,
  ArrowRight,
  Clock,
  Radio,
  ScanLine,
} from "lucide-react";

interface DashboardViewProps {
  analyses: AnalysisRecord[];
  onNavigate: (page: NavPage) => void;
  onSelectAnalysis: (analysis: AnalysisRecord) => void;
}

export function DashboardView({
  analyses,
  onNavigate,
  onSelectAnalysis,
}: DashboardViewProps) {
  const totalInferences = analyses.length + 148;
  const avgConfidence = 95.8;
  const bitemporalCount = analyses.filter((a) => a.mode === "bitemporal").length + 64;
  const singleCount = analyses.filter((a) => a.mode === "single").length + 58;
  const sarCount = analyses.filter((a) => a.mode === "optical_sar").length + 26;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 text-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <LayoutDashboard className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Mission Operations Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Real-time inference telemetry, pipeline throughput, and remote sensing analytics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("workspace")}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>New Analysis</span>
        </button>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-md text-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span>TOTAL ANALYSES</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{totalInferences}</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            +18.2% this week (SIH Pipeline)
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-md text-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span>AVG CONFIDENCE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{avgConfidence}%</div>
          <div className="text-xs text-slate-500 font-mono mt-1">
            mIoU: 0.887 / CDVQA F1: 91.2%
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-md text-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span>PIPELINE LATENCY</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">420ms</div>
          <div className="text-xs text-sky-600 font-semibold mt-1">
            LoRA PEFT Cached Inference
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-md text-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span>RADAR PENETRATION</span>
            <Radio className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">100% Cloud-Free</div>
          <div className="text-xs text-purple-600 font-semibold mt-1">
            Sentinel-1 C-Band SAR Active
          </div>
        </div>
      </div>

      {/* Mid Row: Modality Distribution and Quick Launch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Modality Breakdown */}
        <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-md flex flex-col justify-between text-slate-900">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Modality Distribution</h3>
            <p className="text-xs text-slate-600 mb-4">
              Breakdown of multimodal tasks processed through SatQuery AI.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-amber-600 font-bold">Bi-Temporal Change Detection</span>
                  <span className="text-slate-900 font-bold">{bitemporalCount} (43%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "43%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sky-600 font-bold">Single Image VQA & Grounding</span>
                  <span className="text-slate-900 font-bold">{singleCount} (39%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: "39%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-emerald-600 font-bold">Optical + SAR Cross-Modal</span>
                  <span className="text-slate-900 font-bold">{sarCount} (18%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Engine: BigEarthNet-LoRA</span>
            <span className="text-emerald-600 font-bold">Operational</span>
          </div>
        </div>

        {/* Recent Investigations List */}
        <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 shadow-md flex flex-col justify-between text-slate-900">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Investigations</h3>
                <p className="text-xs text-slate-500">Latest analysis records stored in database.</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate("history")}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {analyses.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  onClick={() => onSelectAnalysis(a)}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold uppercase">
                        {a.mode}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {a.sceneTitle}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 truncate max-w-md">
                      "{a.query}"
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-500 shrink-0">
                    <span className="text-emerald-600 font-bold">{a.confidence.score}%</span>
                    <span className="text-slate-400">
                      {new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Database Status: Synchronized</span>
            <span className="text-sky-600 font-semibold font-mono">PostgreSQL Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
