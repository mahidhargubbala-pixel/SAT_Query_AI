import React, { useState, useRef } from "react";
import { SatelliteScene, BoundingBox, AnalysisMode } from "../types";
import mumbaiSatelliteImg from "../assets/images/mumbai_satellite_viewport_1789119024195.jpg";
import {
  Plus,
  Minus,
  Maximize2,
  Upload,
  Layers,
  Sparkles,
  Split,
  Eye,
  Crosshair,
  Radio,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface SatelliteViewerProps {
  scene: SatelliteScene;
  mode: AnalysisMode;
  boxes: BoundingBox[];
  changePercentage?: number;
  highlightedBoxId: string | null;
  onBoxSelect: (box: BoundingBox) => void;
  isAnalyzing: boolean;
  onUploadScene?: (sceneData: Partial<SatelliteScene>) => Promise<any>;
  activeQuery?: string;
}

export function SatelliteViewer({
  scene,
  mode,
  boxes,
  changePercentage,
  highlightedBoxId,
  onBoxSelect,
  isAnalyzing,
  onUploadScene,
  activeQuery,
}: SatelliteViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [compareSplit, setCompareSplit] = useState<"side_by_side" | "swipe">("side_by_side");
  const [swipePos, setSwipePos] = useState(50);
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleReset = () => setZoom(1);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onUploadScene) return;

    setIsUploading(true);
    try {
      if (files.length === 1) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          await onUploadScene({
            title: file.name.replace(/\.[^/.]+$/, "") || "Custom Observation",
            subtitle: `Uploaded Satellite GeoTIFF / Image (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
            mode: mode,
            image: dataUrl,
            imageT1: dataUrl,
            imageT2: dataUrl,
          });
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } else if (files.length >= 2) {
        const file1 = files[0];
        const file2 = files[1];
        const reader1 = new FileReader();
        const reader2 = new FileReader();

        reader1.onload = () => {
          reader2.onload = async () => {
            await onUploadScene({
              title: `Bi-temporal: ${file1.name.slice(0, 8)} vs ${file2.name.slice(0, 8)}`,
              subtitle: "Uploaded Co-registered Pair (T1 & T2)",
              mode: "bitemporal",
              imageT1: reader1.result as string,
              imageT2: reader2.result as string,
              timestampT1: "T1 Baseline",
              timestampT2: "T2 After",
            });
            setIsUploading(false);
          };
          reader2.readAsDataURL(file2);
        };
        reader1.readAsDataURL(file1);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setIsUploading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200/90 flex flex-col gap-4 text-slate-900 transition-all"
    >
      {/* Viewport Header - EXACT MATCH to user's uploaded Screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Circular badge with letter "A" */}
          <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
            A
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              Satellite Imagery Viewport
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              {scene.title} • <span className="font-mono">{scene.coordinates}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode-specific toggle for bi-temporal */}
          {mode === "bitemporal" && (
            <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setCompareSplit("side_by_side")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  compareSplit === "side_by_side"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Side-by-Side
              </button>
              <button
                type="button"
                onClick={() => setCompareSplit("swipe")}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  compareSplit === "swipe"
                    ? "bg-white text-sky-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Swipe
              </button>
            </div>
          )}

          {/* Toggle Annotations button */}
          <button
            type="button"
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showAnnotations
                ? "bg-sky-50 border-sky-200 text-sky-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Evidence</span>
          </button>

          {/* Upload Image button - REAL FUNCTIONAL UPLOAD */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.tif,.tiff"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
                <span>Saving to DB...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Satellite Viewport Canvas - High resolution, natural satellite photography */}
      <div
        data-satellite-viewer="true"
        className="relative w-full h-[460px] sm:h-[520px] rounded-2xl bg-slate-950 overflow-hidden border border-slate-200 flex items-center justify-center select-none"
      >
        {/* Analyzing Overlay Spinner */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
            <div className="w-10 h-10 rounded-full border-3 border-sky-400 border-t-transparent animate-spin mb-3" />
            <div className="text-sm font-bold tracking-wide">
              Analyzing Multimodal Satellite Imagery...
            </div>
            <div className="text-xs font-mono text-sky-300 mt-1">
              BigEarthNet LoRA Engine Grounding Spatial Evidence
            </div>
          </div>
        )}

        {/* 1. SINGLE IMAGE MODE - TWO NATURAL SATELLITE IMAGES SIDE-BY-SIDE (BEFORE PROMPT vs AFTER PROMPT) */}
        {mode === "single" && (
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {/* Left Image: BEFORE PROMPT (Original Raw Satellite Image, completely unannotated) */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-black/75 backdrop-blur-xs border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>BEFORE PROMPT (ORIGINAL INPUT)</span>
              </div>
              <img
                src={scene.image || mumbaiSatelliteImg}
                alt="Before Prompt Satellite Baseline"
                className="w-full h-full object-cover transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            {/* Right Image: AFTER PROMPT (AI Grounded Visual Evidence with Exact Markings for Query) */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-sky-950/85 backdrop-blur-xs border border-sky-400/50 text-sky-200 font-mono text-xs flex items-center gap-1.5 shadow-md max-w-[90%] truncate">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">
                  {activeQuery ? `AFTER PROMPT: "${activeQuery}"` : "AFTER PROMPT (AI MARKINGS)"}
                </span>
              </div>

              <img
                src={scene.image || mumbaiSatelliteImg}
                alt="After Prompt Satellite Evidence"
                className="w-full h-full object-cover transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
              />

              {/* Bounding Box Visual Evidence Overlays strictly on After Prompt Image */}
              {showAnnotations && boxes.length > 0 ? (
                <div className="absolute inset-0 pointer-events-none">
                  {boxes.map((b) => {
                    const [ymin, xmin, ymax, xmax] = b.box;
                    const isHighlighted = highlightedBoxId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => onBoxSelect(b)}
                        className={`absolute pointer-events-auto rounded-md transition-all cursor-pointer ${
                          isHighlighted
                            ? "ring-2 ring-white ring-offset-2 ring-offset-black z-20"
                            : "hover:ring-1 hover:ring-white"
                        }`}
                        style={{
                          top: `${ymin}%`,
                          left: `${xmin}%`,
                          width: `${xmax - xmin}%`,
                          height: `${ymax - ymin}%`,
                          border: `2px solid ${b.color || "#0284c7"}`,
                          backgroundColor: isHighlighted
                            ? "rgba(2, 132, 199, 0.28)"
                            : "rgba(2, 132, 199, 0.12)",
                        }}
                      >
                        <span
                          className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md truncate max-w-[220px]"
                          style={{ backgroundColor: b.color || "#0284c7" }}
                        >
                          {b.label} ({Math.round(b.confidence * 100)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                !isAnalyzing && (
                  <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xs border border-white/10 text-slate-300 font-mono text-[11px] flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    <span>Enter a natural language prompt below to display markings</span>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* 2. BI-TEMPORAL MODE (Before on Left, After on Right with marked changes) */}
        {mode === "bitemporal" && (
          <div className="w-full h-full relative overflow-hidden flex">
            {compareSplit === "side_by_side" ? (
              <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                {/* T1 Before Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-xs border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>BEFORE: {scene.timestampT1 || "T1 Baseline"}</span>
                  </div>
                  <img
                    src={scene.imageT1 || scene.image || mumbaiSatelliteImg}
                    alt="Satellite Observation T1 (Before)"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>

                {/* T2 After Image with Analyzed Changes */}
                <div className="relative w-full h-full overflow-hidden">
                  <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-xs border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-md">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>AFTER: {scene.timestampT2 || "T2 Observation"}</span>
                    {changePercentage && (
                      <span className="ml-1 text-emerald-400 font-bold">
                        (+{changePercentage}%)
                      </span>
                    )}
                  </div>

                  <img
                    src={scene.imageT2 || scene.image || mumbaiSatelliteImg}
                    alt="Satellite Observation T2 (After)"
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoom})` }}
                  />

                  {/* Bounding Box Visual Evidence on T2 (After) */}
                  {showAnnotations && (
                    <div className="absolute inset-0 pointer-events-none">
                      {boxes.map((b) => {
                        const [ymin, xmin, ymax, xmax] = b.box;
                        const isHighlighted = highlightedBoxId === b.id;
                        return (
                          <div
                            key={b.id}
                            onClick={() => onBoxSelect(b)}
                            className={`absolute pointer-events-auto rounded-md transition-all cursor-pointer ${
                              isHighlighted
                                ? "ring-2 ring-white ring-offset-2 ring-offset-black z-20"
                                : "hover:ring-1 hover:ring-white"
                            }`}
                            style={{
                              top: `${ymin}%`,
                              left: `${xmin}%`,
                              width: `${xmax - xmin}%`,
                              height: `${ymax - ymin}%`,
                              border: `2px solid ${b.color || "#38bdf8"}`,
                              backgroundColor: isHighlighted
                                ? "rgba(56, 189, 248, 0.35)"
                                : "rgba(56, 189, 248, 0.15)",
                            }}
                          >
                            <span
                              className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md truncate max-w-[200px]"
                              style={{ backgroundColor: b.color || "#38bdf8" }}
                            >
                              {b.label} ({Math.round(b.confidence * 100)}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Swipe / Curtain View */
              <div
                className="relative w-full h-full overflow-hidden cursor-ew-resize"
                onMouseDown={() => setIsDraggingSwipe(true)}
                onMouseUp={() => setIsDraggingSwipe(false)}
                onMouseMove={(e) => {
                  if (!isDraggingSwipe) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((e.clientX - rect.left) / rect.width) * 100;
                  setSwipePos(Math.max(5, Math.min(95, pos)));
                }}
              >
                {/* Underneath: T2 After */}
                <img
                  src={scene.imageT2 || scene.image || mumbaiSatelliteImg}
                  alt="After T2"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: `scale(${zoom})` }}
                />

                {/* On Top: T1 Before with clip-path */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${swipePos}%` }}
                >
                  <img
                    src={scene.imageT1 || scene.image || mumbaiSatelliteImg}
                    alt="Before T1"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transform: `scale(${zoom})`,
                      width: containerRef.current?.offsetWidth || "100%",
                      maxWidth: "none",
                    }}
                  />
                </div>

                {/* Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-20 flex items-center justify-center pointer-events-none"
                  style={{ left: `${swipePos}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-bold shadow-md">
                    ⇄
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. OPTICAL + SAR DUAL MODALITY MODE */}
        {mode === "optical_sar" && (
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {/* Optical Sentinel-2 */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-xs border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-md">
                <Radio className="w-3.5 h-3.5 text-sky-400" />
                <span>SENTINEL-2 OPTICAL (TRUE COLOR)</span>
              </div>
              <img
                src={scene.imageOptical || scene.image}
                alt="Optical Satellite"
                className="w-full h-full object-cover"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            {/* Sentinel-1 C-SAR Microwave Radar */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-xs border border-white/20 text-white font-mono text-xs flex items-center gap-1.5 shadow-md">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>SENTINEL-1 C-SAR (RADAR BACKSCATTER)</span>
              </div>
              <img
                src={scene.imageSAR || scene.image || mumbaiSatelliteImg}
                alt="Sentinel-1 SAR Radar"
                className="w-full h-full object-cover"
                style={{ transform: `scale(${zoom})` }}
              />

              {/* Bounding Box Visual Evidence */}
              {showAnnotations && (
                <div className="absolute inset-0 pointer-events-none">
                  {boxes.map((b) => {
                    const [ymin, xmin, ymax, xmax] = b.box;
                    const isHighlighted = highlightedBoxId === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => onBoxSelect(b)}
                        className={`absolute pointer-events-auto rounded-md transition-all cursor-pointer ${
                          isHighlighted
                            ? "ring-2 ring-white ring-offset-2 ring-offset-black z-20"
                            : "hover:ring-1 hover:ring-white"
                        }`}
                        style={{
                          top: `${ymin}%`,
                          left: `${xmin}%`,
                          width: `${xmax - xmin}%`,
                          height: `${ymax - ymin}%`,
                          border: `2px solid ${b.color || "#f59e0b"}`,
                          backgroundColor: isHighlighted
                            ? "rgba(245, 158, 11, 0.35)"
                            : "rgba(245, 158, 11, 0.15)",
                        }}
                      >
                        <span
                          className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md truncate max-w-[200px]"
                          style={{ backgroundColor: b.color || "#f59e0b" }}
                        >
                          {b.label} ({Math.round(b.confidence * 100)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Viewport Controls on the Right - EXACT MATCH to user's uploaded Screenshot */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-1 gap-1 text-slate-700">
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-800" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4 text-slate-800" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Zoom"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 font-mono text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            {zoom}x
          </button>
          <div className="w-6 h-px bg-slate-200 my-0.5" />
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Fullscreen"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4 text-slate-800" />
          </button>
        </div>
      </div>
    </div>
  );
}
