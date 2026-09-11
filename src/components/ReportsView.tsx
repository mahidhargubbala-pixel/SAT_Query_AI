import React, { useState } from "react";
import { ReportRecord, AnalysisRecord } from "../types";
import {
  FileText,
  Printer,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
} from "lucide-react";

interface ReportsViewProps {
  reports: ReportRecord[];
  analyses: AnalysisRecord[];
  onSelectAnalysis: (analysis: AnalysisRecord) => void;
}

export function ReportsView({
  reports,
  analyses,
  onSelectAnalysis,
}: ReportsViewProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];
  const relatedAnalysis = analyses.find((a) => a.id === activeReport?.analysisId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 text-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <FileText className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Intelligence Dossiers & Reports
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Exported mission reports with spatial evidence bounding boxes, spectral metrics, and findings.
          </p>
        </div>

        {activeReport && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>
          </div>
        )}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-12 text-center shadow-md text-slate-900">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No dossiers generated yet</h3>
          <p className="text-xs text-slate-500">
            Run an analysis in the Workspace and click "Export Dossier" to generate a printable report.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports Sidebar List */}
          <div className="rounded-3xl bg-white border border-slate-200/90 p-4 shadow-md flex flex-col gap-2 text-slate-900">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-1 font-mono">
              AVAILABLE REPORTS ({reports.length})
            </div>
            {reports.map((r) => {
              const isSelected = r.id === activeReport?.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReportId(r.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-sky-50 border-sky-300 shadow-xs"
                      : "bg-slate-50 border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold uppercase">
                      {r.mode}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">
                    {r.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Analyst: {r.analyst}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Dossier Preview Card */}
          {activeReport && (
            <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-md flex flex-col gap-6 text-slate-900">
              {/* Dossier Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                      DOSSIER #{activeReport.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">CONFIDENTIAL RS-INTEL</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{activeReport.title}</h2>
                  <div className="text-xs text-slate-600 mt-1">
                    Query: "{activeReport.query}" • Status: {activeReport.status}
                  </div>
                </div>

                <div className="text-right text-xs font-mono text-slate-500">
                  <div>Date: {new Date(activeReport.createdAt).toLocaleString()}</div>
                  <div className="text-emerald-600 font-bold">
                    Analyst: {activeReport.analyst}
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2">
                  1. EXECUTIVE SUMMARY & VERIFIED FINDING
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {activeReport.summary}
                </p>
              </div>

              {/* Findings & Metrics (from related analysis) */}
              {relatedAnalysis && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono mb-2">
                    2. METRIC TELEMETRY & OBSERVATIONS
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-400 text-[10px]">CRS PROJECTION</div>
                      <div className="font-bold text-slate-800 truncate">
                        {relatedAnalysis.technicalDetails.crs.split("(")[0]}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-400 text-[10px]">EVIDENCE ZONES</div>
                      <div className="font-bold text-sky-700">
                        {relatedAnalysis.evidence.boundingBoxes?.length || 0} targets
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-400 text-[10px]">CONFIDENCE</div>
                      <div className="font-bold text-emerald-600">
                        {relatedAnalysis.confidence.score}%
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-slate-400 text-[10px]">RESOLUTION (GSD)</div>
                      <div className="font-bold text-slate-800">
                        {relatedAnalysis.technicalDetails.gsd}
                      </div>
                    </div>
                  </div>

                  {relatedAnalysis.evidence.keyObservations && (
                    <div className="space-y-1.5">
                      {relatedAnalysis.evidence.keyObservations.map((obs, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80"
                        >
                          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                          <span>{obs}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Related Analysis Action */}
              {relatedAnalysis && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectAnalysis(relatedAnalysis)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Inspect In Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
