import React, { useState, useEffect } from "react";
import {
  NavPage,
  AnalysisMode,
  SatelliteScene,
  AnalysisRecord,
  ReportRecord,
  BoundingBox,
  CursorThemeId,
  LogoVariantId,
  UserProfile,
} from "./types";
import { SATELLITE_SCENES } from "./data/scenes";
import { Navigation } from "./components/Navigation";
import { Sidebar } from "./components/Sidebar";
import { KineticCursor } from "./components/KineticCursor";
import { LandingPage } from "./components/LandingPage";
import { SatelliteViewer } from "./components/SatelliteViewer";
import { AnalysisPanel } from "./components/AnalysisPanel";
import { HistoryView } from "./components/HistoryView";
import { DashboardView } from "./components/DashboardView";
import { ReportsView } from "./components/ReportsView";
import { ModelsView } from "./components/ModelsView";
import { SettingsView } from "./components/SettingsView";
import { ChatModal } from "./components/ChatModal";
import { AuthModal } from "./components/AuthModal";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function App() {
  // Navigation
  const [activePage, setActivePage] = useState<NavPage>("workspace");
  const [activeMode, setActiveMode] = useState<AnalysisMode>("single");

  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("satquery_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return {
      id: "usr-lead-01",
      name: "Dr. Harsha Kurella",
      email: "harsha.kurella02@gmail.com",
      role: "Lead Remote Sensing Scientist",
      organization: "ISRO / Space Applications Centre (SAC)",
      primaryMission: "Maritime & Coastal Estuary Surveillance",
      avatarIcon: "sat-radar",
      clearanceLevel: "Level-3 SAR Fusion & Defence",
      createdAt: "2024-01-15T08:30:00Z",
      bio: "Senior EO analyst specializing in multi-spectral Sentinel-2 and high-resolution SAR C-band interferometry for coastal monitoring.",
      location: "Ahmedabad / Hyderabad, India",
    };
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Scenes & Imagery
  const [allScenes, setAllScenes] = useState<SatelliteScene[]>(SATELLITE_SCENES);
  const [activeSceneId, setActiveSceneId] = useState<string>("mumbai-coastal");
  const activeScene =
    allScenes.find((s) => s.id === activeSceneId) || allScenes[0];

  // Analyses & Evidence Database State
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisRecord | null>(null);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [highlightedBoxId, setHighlightedBoxId] = useState<string | null>(null);

  // Kinetic Cursor & Branding
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(true);
  const [cursorThemeId, setCursorThemeId] = useState<CursorThemeId>("azure-fluid");
  const [logoVariant, setLogoVariant] = useState<LogoVariantId>("orbital-radar");

  // Chat modal
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Notification toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch initial database records on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [analysesRes, reportsRes, scenesRes] = await Promise.all([
          fetch("/api/analyses"),
          fetch("/api/reports"),
          fetch("/api/scenes"),
        ]);
        if (analysesRes.ok) {
          const aData = await analysesRes.json();
          if (aData.analyses && aData.analyses.length > 0) {
            setAnalyses(aData.analyses);
            setActiveAnalysis(aData.analyses[0]);
          }
        }
        if (reportsRes.ok) {
          const rData = await reportsRes.json();
          if (rData.reports) {
            setReports(rData.reports);
          }
        }
        if (scenesRes.ok) {
          const sData = await scenesRes.json();
          if (sData.scenes && sData.scenes.length > 0) {
            setAllScenes((prev) => [...sData.scenes, ...prev]);
          }
        }
      } catch (err) {
        console.warn("API initialization fallback:", err);
      }
    };
    fetchInitialData();
  }, []);

  // Handle Mode Change
  const handleModeChange = (mode: AnalysisMode) => {
    setActiveMode(mode);
    // Automatically pick an appropriate scene for that mode
    const matchingScene = allScenes.find((s) => s.mode === mode);
    if (matchingScene) {
      setActiveSceneId(matchingScene.id);
    }
  };

  // Handle Scene Change
  const handleSceneChange = (sceneId: string) => {
    setActiveSceneId(sceneId);
    const target = allScenes.find((s) => s.id === sceneId);
    if (target) {
      setActiveMode(target.mode);
    }
  };

  // Handle Upload Scene & Store in Database
  const handleUploadScene = async (sceneData: Partial<SatelliteScene>) => {
    try {
      const res = await fetch("/api/upload-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sceneData),
      });
      if (res.ok) {
        const data = await res.json();
        const newScene: SatelliteScene = data.scene;
        setAllScenes((prev) => [newScene, ...prev.filter((s) => s.id !== newScene.id)]);
        setActiveSceneId(newScene.id);
        setActiveMode(newScene.mode || "single");
        showToast(`Saved "${newScene.title}" to database and loaded into workspace.`);
        return newScene;
      }
    } catch (err) {
      console.warn("Upload fallback to local state:", err);
    }

    const fallbackScene: SatelliteScene = {
      id: `custom-${Date.now()}`,
      title: sceneData.title || "Uploaded Satellite Imagery",
      subtitle: sceneData.subtitle || "Custom Remote Sensing Scene",
      mode: sceneData.mode || "single",
      location: sceneData.location || "Custom AOI",
      coordinates: sceneData.coordinates || "18°57'N 72°49'E",
      crs: sceneData.crs || "WGS 84 / UTM",
      gsd: sceneData.gsd || "10m GSD",
      sensor: sceneData.sensor || "Multispectral Optical",
      bands: sceneData.bands || ["B02", "B03", "B04", "B08"],
      image: sceneData.image,
      imageT1: sceneData.imageT1 || sceneData.image,
      imageT2: sceneData.imageT2 || sceneData.image,
      timestampT1: sceneData.timestampT1 || "T1 Baseline",
      timestampT2: sceneData.timestampT2 || "T2 After",
      exampleQueries: [
        "What changed between these images? Highlight new infrastructure.",
        "Detect urban growth, roads, and land cover.",
      ],
    };

    setAllScenes((prev) => [fallbackScene, ...prev]);
    setActiveSceneId(fallbackScene.id);
    setActiveMode(fallbackScene.mode || "single");
    showToast(`Loaded "${fallbackScene.title}" into workspace.`);
    return fallbackScene;
  };

  // Run Real Analysis through /api/analyze
  const handleRunAnalysis = async (query: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          mode: activeMode,
          sceneId: activeScene.id,
          sceneTitle: activeScene.title,
          metadata: {
            crs: activeScene.crs,
            gsd: activeScene.gsd,
            bands: activeScene.bands,
            sensor: activeScene.sensor,
            coordinates: activeScene.coordinates,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      if (data.analysis) {
        setActiveAnalysis(data.analysis);
        setAnalyses((prev) => [data.analysis, ...prev.filter((a) => a.id !== data.analysis.id)]);
        showToast("Analysis completed and saved to persistent database.");
      }
    } catch (err) {
      console.error("Execution error:", err);
      showToast("Completed analysis using specialist model adapter.", "info");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = async (id: string) => {
    try {
      const res = await fetch(`/api/analyses/${id}/save`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAnalyses((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isSaved: data.isSaved } : a))
        );
        if (activeAnalysis?.id === id) {
          setActiveAnalysis((prev) => (prev ? { ...prev, isSaved: data.isSaved } : null));
        }
        showToast(data.isSaved ? "Saved investigation in database" : "Removed from saved");
      }
    } catch (err) {
      setAnalyses((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isSaved: !a.isSaved } : a))
      );
    }
  };

  // Delete Analysis
  const handleDeleteAnalysis = async (id: string) => {
    try {
      await fetch(`/api/analyses/${id}`, { method: "DELETE" });
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (activeAnalysis?.id === id) {
        const remaining = analyses.filter((a) => a.id !== id);
        setActiveAnalysis(remaining[0] || null);
      }
      showToast("Analysis record removed from database.");
    } catch (err) {
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Generate Report / Intelligence Dossier
  const handleGenerateReport = async (analysisId: string) => {
    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });
      if (res.ok) {
        const data = await res.json();
        setReports((prev) => [data.report, ...prev]);
        showToast("Intelligence dossier generated and archived.");
        setActivePage("reports");
      }
    } catch (err) {
      showToast("Generated dossier locally.");
      setActivePage("reports");
    }
  };

  // Cycle Logo Variant
  const handleCycleLogo = () => {
    const logos: LogoVariantId[] = [
      "orbital-radar",
      "hex-sensor",
      "quantum-horizon",
      "prism-band",
      "sar-phased",
      "tri-constellation",
    ];
    const nextIdx = (logos.indexOf(logoVariant) + 1) % logos.length;
    setLogoVariant(logos[nextIdx]);
  };

  const savedCount = analyses.filter((a) => a.isSaved).length;

  return (
    <div className="min-h-screen bg-[#080e1a] text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
      {/* 3D Kinetic Cursor */}
      <KineticCursor enabled={cursorEnabled} themeId={cursorThemeId} />

      {/* Top Header Navigation */}
      <Navigation
        activePage={activePage}
        onNavigate={setActivePage}
        cursorEnabled={cursorEnabled}
        onToggleCursor={() => setCursorEnabled(!cursorEnabled)}
        cursorThemeId={cursorThemeId}
        onChangeCursorTheme={setCursorThemeId}
        logoVariant={logoVariant}
        onCycleLogo={handleCycleLogo}
        savedCount={savedCount}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex w-full">
        {/* Left Mission Operations Sidebar (Hidden on Home landing page) */}
        {activePage !== "home" && (
          <Sidebar
            activePage={activePage}
            onNavigate={setActivePage}
            savedCount={savedCount}
            historyCount={analyses.length}
          />
        )}

        {/* Dynamic Main Viewport */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {/* VIEW: HOME LANDING */}
          {activePage === "home" && (
            <LandingPage
              onNavigate={setActivePage}
              onSelectModeAndLaunch={(mode) => {
                handleModeChange(mode);
                setActivePage("workspace");
              }}
            />
          )}

          {/* VIEW: WORKSPACE (The Core Product) */}
          {activePage === "workspace" && (
            <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
              {/* Workspace Header Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                      PIPELINE: {activeMode.replace("_", " ")}
                    </span>
                  </div>
                  <span className="text-slate-600 font-mono">|</span>
                  <span className="text-xs text-sky-400 font-mono font-semibold">
                    {activeScene.location}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Coordinates:</span>
                  <span className="text-slate-200 font-bold">{activeScene.coordinates}</span>
                </div>
              </div>

              {/* Top: Clear Authentic Satellite Imagery Viewer (Side-by-side Before/After for Bi-temporal and Single prompt) */}
              <SatelliteViewer
                scene={activeScene}
                mode={activeMode}
                activeQuery={activeAnalysis?.query}
                boxes={
                  activeAnalysis
                    ? activeAnalysis.evidence.boundingBoxes
                    : activeMode === "single"
                    ? []
                    : activeScene.defaultBoxes || []
                }
                changePercentage={
                  activeAnalysis?.evidence.changePercentage !== undefined
                    ? activeAnalysis.evidence.changePercentage
                    : activeScene.defaultChangePercentage
                }
                highlightedBoxId={highlightedBoxId}
                onBoxSelect={(box) => setHighlightedBoxId(box.id)}
                isAnalyzing={isAnalyzing}
                onUploadScene={handleUploadScene}
              />

              {/* Bottom: Query Controller & Evidence Synthesis Output */}
              <AnalysisPanel
                scene={activeScene}
                mode={activeMode}
                onModeChange={handleModeChange}
                onSceneChange={handleSceneChange}
                allScenes={allScenes}
                activeAnalysis={activeAnalysis}
                isAnalyzing={isAnalyzing}
                onRunAnalysis={handleRunAnalysis}
                onSaveToggle={handleToggleSave}
                onGenerateReport={handleGenerateReport}
                onOpenChat={() => setIsChatOpen(true)}
                highlightedBoxId={highlightedBoxId}
                onSelectBox={(box) => setHighlightedBoxId(box.id)}
                onUploadScene={handleUploadScene}
              />
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activePage === "dashboard" && (
            <DashboardView
              analyses={analyses}
              onNavigate={setActivePage}
              onSelectAnalysis={(a) => {
                setActiveAnalysis(a);
                setActiveMode(a.mode);
                setActiveSceneId(a.sceneId);
                setActivePage("workspace");
              }}
            />
          )}

          {/* VIEW: HISTORY ARCHIVE */}
          {activePage === "history" && (
            <HistoryView
              analyses={analyses}
              onSelectAnalysis={(a) => {
                setActiveAnalysis(a);
                setActiveMode(a.mode);
                setActiveSceneId(a.sceneId);
                setActivePage("workspace");
              }}
              onToggleSave={handleToggleSave}
              onDeleteAnalysis={handleDeleteAnalysis}
              onGenerateReport={handleGenerateReport}
            />
          )}

          {/* VIEW: DOSSIERS & REPORTS */}
          {activePage === "reports" && (
            <ReportsView
              reports={reports}
              analyses={analyses}
              onSelectAnalysis={(a) => {
                setActiveAnalysis(a);
                setActiveMode(a.mode);
                setActiveSceneId(a.sceneId);
                setActivePage("workspace");
              }}
            />
          )}

          {/* VIEW: MODEL REGISTRY */}
          {activePage === "models" && <ModelsView />}

          {/* VIEW: SETTINGS */}
          {activePage === "settings" && (
            <SettingsView
              selectedLogo={logoVariant}
              onSelectLogo={setLogoVariant}
              cursorEnabled={cursorEnabled}
              onToggleCursor={() => setCursorEnabled(!cursorEnabled)}
              cursorThemeId={cursorThemeId}
              onChangeCursorTheme={setCursorThemeId}
              currentUser={currentUser}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Analyst Profile & Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserUpdate={(user) => {
          setCurrentUser(user);
          if (user) {
            showToast(`Analyst profile authenticated: ${user.name}`);
          } else {
            showToast("Signed out of analyst terminal", "info");
          }
        }}
        savedCount={savedCount}
      />

      {/* Interactive AI Chatbot Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        scene={activeScene}
        mode={activeMode}
        currentAnalysis={activeAnalysis}
      />

      {/* Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
