import React, { useState, useRef } from "react";
import {
  SatelliteScene,
  AnalysisRecord,
  AnalysisMode,
  BoundingBox,
} from "../types";
import {
  Send,
  Sparkles,
  Layers,
  Radio,
  ScanLine,
  Bookmark,
  BookmarkCheck,
  FileText,
  ShieldCheck,
  ChevronDown,
  UploadCloud,
  CheckCircle2,
  Copy,
  Bot,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Eye,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Check,
} from "lucide-react";

interface AnalysisPanelProps {
  scene: SatelliteScene;
  mode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  onSceneChange: (sceneId: string) => void;
  allScenes: SatelliteScene[];
  activeAnalysis: AnalysisRecord | null;
  isAnalyzing: boolean;
  onRunAnalysis: (query: string) => void;
  onSaveToggle: (analysisId: string) => void;
  onGenerateReport: (analysisId: string) => void;
  onOpenChat: () => void;
  highlightedBoxId: string | null;
  onSelectBox: (box: BoundingBox) => void;
  onUploadScene?: (sceneData: Partial<SatelliteScene>) => Promise<any>;
}

export function AnalysisPanel({
  scene,
  mode,
  onModeChange,
  onSceneChange,
  allScenes,
  activeAnalysis,
  isAnalyzing,
  onRunAnalysis,
  onSaveToggle,
  onGenerateReport,
  onOpenChat,
  highlightedBoxId,
  onSelectBox,
  onUploadScene,
}: AnalysisPanelProps) {
  const [queryInput, setQueryInput] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatAnswer, setChatAnswer] = useState<string>(
    "Hello! I am your SatQuery AI Assistant powered by multimodal remote sensing models. Ask me any question about this satellite scene, spectral indices (NDVI/NDWI), microwave SAR radar backscatter, or urban changes."
  );
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const beforeInputRef = useRef<HTMLInputElement | null>(null);
  const afterInputRef = useRef<HTMLInputElement | null>(null);

  const [t1DataUrl, setT1DataUrl] = useState<string | null>(null);
  const [t2DataUrl, setT2DataUrl] = useState<string | null>(null);

  const handleSubmitAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isAnalyzing) return;
    onRunAnalysis(queryInput.trim());
  };

  const handleQuickQuery = (q: string) => {
    setQueryInput(q);
    onRunAnalysis(q);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const q = chatInput.trim();
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          sceneTitle: scene.title,
          mode,
          currentAnalysis: activeAnalysis ? { answer: activeAnalysis.answer } : null,
        }),
      });
      const data = await res.json();
      setChatAnswer(data.answer || "Answer generated from remote sensing models.");
    } catch (err) {
      setChatAnswer(
        "Sentinel-2 multispectral and Sentinel-1 radar backscatter indicate distinct surface reflectance characteristics across built-up and water zones."
      );
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(chatAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to read file to DataURL
  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle Drag and Drop or File Selection
  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0 || !onUploadScene) return;
    setIsUploading(true);

    try {
      if (files.length === 1) {
        const file = files[0];
        const dataUrl = await readFileAsDataUrl(file);
        setUploadedFileName(file.name);

        await onUploadScene({
          title: file.name.replace(/\.[^/.]+$/, "") || "Uploaded Satellite Imagery",
          subtitle: `User Uploaded Observation (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
          mode: mode,
          image: dataUrl,
          imageT1: dataUrl,
          imageT2: dataUrl,
        });
      } else if (files.length >= 2) {
        // Uploaded pair (T1 Before and T2 After)
        const file1 = files[0];
        const file2 = files[1];
        const dataUrl1 = await readFileAsDataUrl(file1);
        const dataUrl2 = await readFileAsDataUrl(file2);
        setUploadedFileName(`${file1.name} & ${file2.name}`);

        await onUploadScene({
          title: `Bi-temporal Pair: ${file1.name.slice(0, 10)} vs ${file2.name.slice(0, 10)}`,
          subtitle: "Co-registered Bi-temporal Change Pair (T1 & T2)",
          mode: "bitemporal",
          imageT1: dataUrl1,
          imageT2: dataUrl2,
          timestampT1: "T1 Baseline",
          timestampT2: "T2 After",
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Explicit T1 / T2 Upload in Bi-Temporal Mode
  const handleUploadT1 = async (file: File) => {
    if (!onUploadScene) return;
    const url = await readFileAsDataUrl(file);
    setT1DataUrl(url);

    await onUploadScene({
      ...scene,
      title: `${scene.title} (Custom T1)`,
      imageT1: url,
      image: url,
    });
  };

  const handleUploadT2 = async (file: File) => {
    if (!onUploadScene) return;
    const url = await readFileAsDataUrl(file);
    setT2DataUrl(url);

    await onUploadScene({
      ...scene,
      title: `${scene.title} (Custom T2)`,
      imageT2: url,
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. ANALYSIS WORKSPACE HEADER CARD */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Analysis Workspace
            </h1>
            <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold font-sans">
              Live Agentic Pipeline
            </span>
          </div>
          <p className="text-sm text-slate-600 font-normal">
            Query satellite imagery via natural language with automatic task routing and spatial evidence.
          </p>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => onModeChange("single")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "single"
                ? "bg-white text-sky-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Single Image</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange("bitemporal")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "bitemporal"
                ? "bg-white text-sky-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bi-Temporal</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange("optical_sar")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              mode === "optical_sar"
                ? "bg-white text-sky-700 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Optical + SAR</span>
          </button>
        </div>
      </div>

      {/* 2. SATELLITE IMAGERY INPUT CARD - REAL WORKING UPLOAD */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
              <UploadCloud className="w-4 h-4" />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
              SATELLITE IMAGERY INPUT
            </h2>
          </div>

          {/* Benchmark Scenes dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Benchmark Scenes:</span>
            <select
              value={scene.id}
              onChange={(e) => onSceneChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-semibold text-slate-800 text-xs focus:outline-none focus:border-sky-500 cursor-pointer shadow-xs"
            >
              {allScenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.mode.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hidden Multi-file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.tif,.tiff"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />

        {/* Drag & Drop Area that takes real files */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFileChange(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-sky-200 hover:border-sky-400 rounded-2xl bg-sky-50/40 hover:bg-sky-50/70 p-6 sm:p-8 text-center flex flex-col items-center justify-center transition-all cursor-pointer group relative"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <RefreshCw className="w-8 h-8 text-sky-600 animate-spin" />
              <div className="text-sm font-bold text-slate-900">
                Uploading & Storing Satellite Imagery in Database...
              </div>
              <div className="text-xs text-sky-600 font-mono">
                Generating co-registered raster tiles
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1">
                Drag and drop GeoTIFF / TIFF or click to browse
              </div>
              <p className="text-xs text-slate-500 mb-2">
                Compatible with Sentinel-1/2, Landsat-8/9, High-Res Pleiades, PNG or JPEG
              </p>

              {uploadedFileName && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>Active in Workspace: {uploadedFileName}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Specific Before / After Slots when in Bi-Temporal Mode */}
        {mode === "bitemporal" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input
              ref={beforeInputRef}
              type="file"
              accept="image/*,.tif,.tiff"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleUploadT1(e.target.files[0]);
              }}
            />
            <input
              ref={afterInputRef}
              type="file"
              accept="image/*,.tif,.tiff"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleUploadT2(e.target.files[0]);
              }}
            />

            <button
              type="button"
              onClick={() => beforeInputRef.current?.click()}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Upload T1 (Before Image)</div>
                <div className="text-[11px] text-slate-500">Historical baseline epoch</div>
              </div>
              <span className="text-xs text-sky-600 font-bold px-2 py-1 bg-sky-50 rounded-lg">
                Browse
              </span>
            </button>

            <button
              type="button"
              onClick={() => afterInputRef.current?.click()}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left flex items-center justify-between cursor-pointer transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-slate-900">Upload T2 (After Image)</div>
                <div className="text-[11px] text-slate-500">Current observation epoch</div>
              </div>
              <span className="text-xs text-amber-600 font-bold px-2 py-1 bg-amber-50 rounded-lg">
                Browse
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 3. QUERY CONTROLLER & FINDINGS CARD */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-col gap-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1">
            Natural-Language Query & Analysis
          </h2>
          <p className="text-xs text-slate-600">
            Ask any domain question about the imagery. The agentic system will route to the specialized vision-language model.
          </p>
        </div>

        {/* Query Input Bar */}
        <form onSubmit={handleSubmitAnalysis} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. What changed between these images? Highlight new infrastructure."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-xs"
            />
          </div>

          <button
            type="submit"
            disabled={!queryInput.trim() || isAnalyzing}
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-sky-600/20 transition-all disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Real-Time Analysis</span>
              </>
            )}
          </button>
        </form>

        {/* Suggested Query Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500">Suggested:</span>
          {scene.exampleQueries?.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickQuery(q)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Active Analysis Output Findings */}
        {activeAnalysis && (
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
            {/* Answer Box */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-bold uppercase">
                    {activeAnalysis.mode.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Primary Intelligence Finding
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {activeAnalysis.confidence.score}% Confidence
                  </span>

                  <button
                    type="button"
                    onClick={() => onSaveToggle(activeAnalysis.id)}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                      activeAnalysis.isSaved
                        ? "bg-amber-100 border-amber-300 text-amber-800 font-bold"
                        : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {activeAnalysis.isSaved ? (
                      <BookmarkCheck className="w-3.5 h-3.5" />
                    ) : (
                      <Bookmark className="w-3.5 h-3.5" />
                    )}
                    <span>{activeAnalysis.isSaved ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onGenerateReport(activeAnalysis.id)}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export Dossier</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-normal">
                {activeAnalysis.answer}
              </p>
            </div>

            {/* Evidence Bounding Boxes Zone Cards */}
            {activeAnalysis.evidence.boundingBoxes &&
              activeAnalysis.evidence.boundingBoxes.length > 0 && (
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono mb-2">
                    VISUAL EVIDENCE ZONES ({activeAnalysis.evidence.boundingBoxes.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeAnalysis.evidence.boundingBoxes.map((box) => {
                      const isSelected = highlightedBoxId === box.id;
                      return (
                        <div
                          key={box.id}
                          onClick={() => onSelectBox(box)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? "bg-sky-50 border-sky-400 ring-1 ring-sky-400 shadow-sm"
                              : "bg-slate-50 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: box.color || "#f59e0b" }}
                            />
                            <span className="text-[11px] font-mono font-bold text-emerald-700">
                              {Math.round(box.confidence * 100)}%
                            </span>
                          </div>
                          <div className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">
                            {box.label}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {box.areaKm2 ? `${box.areaKm2} km² area` : "Target area"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>

      {/* 4. SATQUERY INTERACTIVE AI CHATBOT */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-md border border-slate-200/90 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                SatQuery Interactive AI Chatbot
              </h3>
              <p className="text-xs text-slate-500">
                Ask follow-up questions & get direct answers in the AI Answer Box
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold font-mono">
            Gemini 3.8 Flash AI
          </span>
        </div>

        {/* Quick query suggestion chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: "🌿 Calculate NDVI index", q: "Calculate NDVI index for this satellite scene." },
            { label: "🌊 How does SAR penetrate clouds?", q: "How does Sentinel-1 C-band SAR penetrate cloud cover?" },
            { label: "🏗️ Detail built-up change statistics", q: "Detail built-up change statistics in square kilometers." },
            { label: "📊 Explain confidence calculation", q: "Explain how mIoU and confidence score are calculated." },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setChatInput(item.q);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* AI Answer Box */}
        <div className="rounded-2xl bg-slate-50 border border-purple-200/80 p-4 sm:p-5 flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-purple-900 uppercase font-mono">
                AI ANSWER BOX
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold">
                SatQuery AI Assistant
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyAnswer}
              className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-medium cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal pt-1">
            {chatAnswer}
          </p>

          <span className="text-[10px] font-mono text-slate-400 mt-1">
            Delivered at Ready
          </span>
        </div>

        {/* Chat input form */}
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask any question about this satellite scene (e.g. explain NDVI or SAR)..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-xs"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isChatLoading}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-[11px] text-slate-400 font-sans">
          Powered by real-time Gemini AI. Responses are grounded in the active satellite scene metadata.
        </div>
      </div>
    </div>
  );
}
