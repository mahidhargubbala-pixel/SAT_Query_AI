import React from "react";
import { LogoVariantId, CursorThemeId, UserProfile } from "../types";
import { LOGO_VARIANTS_METADATA, LogoEmblem } from "./BrandingLogos";
import { CURSOR_THEMES } from "./KineticCursor";
import {
  Settings,
  Check,
  MousePointer,
  Sparkles,
  Sliders,
  Database,
  Shield,
  User,
  Building2,
  Compass,
  ShieldCheck,
  Edit3,
} from "lucide-react";

interface SettingsViewProps {
  selectedLogo: LogoVariantId;
  onSelectLogo: (id: LogoVariantId) => void;
  cursorEnabled: boolean;
  onToggleCursor: () => void;
  cursorThemeId: CursorThemeId;
  onChangeCursorTheme: (id: CursorThemeId) => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal?: () => void;
}

export function SettingsView({
  selectedLogo,
  onSelectLogo,
  cursorEnabled,
  onToggleCursor,
  cursorThemeId,
  onChangeCursorTheme,
  currentUser,
  onOpenAuthModal,
}: SettingsViewProps) {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Settings className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Analyst & System Settings
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Configure analyst identity, security credentials, branding logos, and 3D kinetic cursor trails.
          </p>
        </div>
      </div>

      {/* 0. ANALYST PROFILE & AUTHENTICATION CREDENTIALS */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Analyst Profile & Security Credentials
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active identity, space agency affiliation, dataset clearance, and profile details.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{currentUser ? "Manage Profile / Switch User" : "Sign In / Register"}</span>
          </button>
        </div>

        {currentUser ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-slate-400 block text-[10px]">ANALYST CALL-SIGN</span>
                <span className="text-white font-bold text-sm">{currentUser.name}</span>
                <span className="text-[11px] text-sky-400 block truncate">{currentUser.email}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">AFFILIATION & ROLE</span>
              <span className="text-emerald-400 font-bold block truncate">{currentUser.organization}</span>
              <span className="text-[11px] text-slate-300 block truncate mt-0.5">{currentUser.role}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1">MISSION & CLEARANCE</span>
              <span className="text-amber-400 font-bold block text-[11px] truncate">
                {currentUser.clearanceLevel}
              </span>
              <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                {currentUser.primaryMission}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              No analyst credentials authenticated. Sign in or register to log investigations under your name.
            </span>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
            >
              Sign In or Create Account &rarr;
            </button>
          </div>
        )}
      </div>

      {/* 1. BRANDING & UNIQUE LOGO VARIANTS (Matches Screenshot 10 & 11) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight">
              Branding & Unique Logo Variants
            </h2>
            <span className="text-xs font-mono text-sky-400 font-bold">
              6 Scientific Variants
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any emblem variant to apply it across the application header and reports.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {LOGO_VARIANTS_METADATA.map((logo) => {
            const isSelected = selectedLogo === logo.id;
            return (
              <div
                key={logo.id}
                onClick={() => onSelectLogo(logo.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-sky-600/15 border-sky-500 ring-1 ring-sky-500 shadow-lg"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700/80">
                    <LogoEmblem variant={logo.id} size="md" />
                  </div>
                  {isSelected ? (
                    <span className="p-1 rounded-full bg-sky-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500">SELECT</span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{logo.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {logo.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. 3D KINETIC CURSOR TRAIL THEMES (Matches Screenshot 9) */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              3D Kinetic Cursor Themes
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Aerospace cursor with fluid particle trails and radar reticle targeting over satellite viewers.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleCursor}
            className={`px-4 py-2 rounded-xl border text-xs font-bold font-mono transition-colors cursor-pointer ${
              cursorEnabled
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                : "bg-slate-950 border-slate-800 text-slate-400"
            }`}
          >
            {cursorEnabled ? "CURSOR: ENABLED" : "CURSOR: DISABLED"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {(Object.keys(CURSOR_THEMES) as CursorThemeId[]).map((tid) => {
            const t = CURSOR_THEMES[tid];
            const isSelected = cursorThemeId === tid;
            return (
              <div
                key={tid}
                onClick={() => onChangeCursorTheme(tid)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-800/80 border-sky-500 ring-1 ring-sky-500 shadow-lg"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-5 h-5 rounded-full shadow-md"
                      style={{ backgroundColor: t.primary }}
                    />
                    {isSelected && (
                      <span className="p-1 rounded-full bg-sky-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">{t.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {t.tag}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PIPELINE & GEOSPATIAL RUNTIME SPECS */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl flex flex-col gap-3">
        <h2 className="text-base font-bold text-white tracking-tight mb-1">
          Geospatial Runtime Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-1">COORDINATE REFERENCE SYSTEM:</span>
            <span className="text-white font-bold">WGS 84 / UTM Multi-Zone</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-1">OPTICAL MULTISPECTRAL:</span>
            <span className="text-sky-400 font-bold">Sentinel-2 13-Band BOA Level-2A</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block mb-1">RADAR MICROWAVE POLARIZATION:</span>
            <span className="text-amber-400 font-bold">Sentinel-1 C-Band (VV + VH Dual-Pol)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
