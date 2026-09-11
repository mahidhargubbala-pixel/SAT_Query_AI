import React, { useState } from "react";
import { AnalysisRecord, AnalysisMode } from "../types";
import {
  History,
  Search,
  Bookmark,
  BookmarkCheck,
  Trash2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";

interface HistoryViewProps {
  analyses: AnalysisRecord[];
  onSelectAnalysis: (analysis: AnalysisRecord) => void;
  onToggleSave: (id: string) => void;
  onDeleteAnalysis: (id: string) => void;
  onGenerateReport: (analysisId: string) => void;
}

export function HistoryView({
  analyses,
  onSelectAnalysis,
  onToggleSave,
  onDeleteAnalysis,
  onGenerateReport,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [onlySaved, setOnlySaved] = useState(false);

  const filtered = analyses.filter((a) => {
    if (onlySaved && !a.isSaved) return false;
    if (filterMode !== "all" && a.mode !== filterMode) return false;
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return (
        a.query.toLowerCase().includes(term) ||
        a.sceneTitle.toLowerCase().includes(term) ||
        a.answer.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 text-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <History className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Investigation History Archive
            </h1>
          </div>
          <p className="text-xs text-slate-600">
            Persistent intelligence database of completed remote sensing analyses and visual evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOnlySaved(!onlySaved)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              onlySaved
                ? "bg-amber-100 border-amber-300 text-amber-800"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Only</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-3 text-slate-900">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queries, locations, or findings..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
          />
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {[
            { id: "all", label: "All Modes" },
            { id: "single", label: "Single Image" },
            { id: "bitemporal", label: "Bi-Temporal" },
            { id: "optical_sar", label: "Optical + SAR" },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setFilterMode(m.id)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-semibold ${
                filterMode === m.id
                  ? "bg-white text-sky-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyses List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200/90 p-12 text-center shadow-md">
          <History className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No investigations found</h3>
          <p className="text-xs text-slate-500">
            {searchTerm || onlySaved
              ? "Try adjusting your search filters or clearing saved only."
              : "Launch an analysis from the Workspace to record your first investigation."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="rounded-3xl bg-white border border-slate-200/90 p-5 shadow-md hover:border-sky-300 transition-all flex flex-col gap-3 text-slate-900"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      a.mode === "bitemporal"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : a.mode === "optical_sar"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-sky-100 text-sky-800 border border-sky-200"
                    }`}
                  >
                    {a.mode.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {a.sceneTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {a.confidence.score}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(a.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              {/* Query & Answer */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-1">
                  Q: "{a.query}"
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {a.answer}
                </p>
              </div>

              {/* Footer / Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                  <span>
                    {a.evidence.boundingBoxes ? a.evidence.boundingBoxes.length : 0} Evidence Zones
                  </span>
                  {a.evidence.changePercentage !== undefined && (
                    <span className="text-amber-600 font-bold">
                      Δ {a.evidence.changePercentage > 0 ? "+" : ""}{a.evidence.changePercentage}% Change
                    </span>
                  )}
                  <span className="hidden sm:inline-block text-slate-400">
                    CRS: {a.technicalDetails.crs.split("(")[0]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleSave(a.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      a.isSaved
                        ? "bg-amber-100 border-amber-300 text-amber-800"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                    }`}
                    title={a.isSaved ? "Saved in Database" : "Save Record"}
                  >
                    {a.isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onGenerateReport(a.id)}
                    className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title="Generate Dossier"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectAnalysis(a)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAnalysis(a.id)}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
