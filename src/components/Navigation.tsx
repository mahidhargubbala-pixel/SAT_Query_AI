import React, { useState } from "react";
import { NavPage, CursorThemeId, LogoVariantId, UserProfile } from "../types";
import { AppLogo } from "./BrandingLogos";
import { CURSOR_THEMES } from "./KineticCursor";
import {
  Sparkles,
  User,
  ChevronDown,
  UserPlus,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface NavigationProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  cursorEnabled: boolean;
  onToggleCursor: () => void;
  cursorThemeId: CursorThemeId;
  onChangeCursorTheme: (themeId: CursorThemeId) => void;
  logoVariant: LogoVariantId;
  onCycleLogo: () => void;
  savedCount: number;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
}

export function Navigation({
  activePage,
  onNavigate,
  cursorEnabled,
  onToggleCursor,
  cursorThemeId,
  onChangeCursorTheme,
  logoVariant,
  onCycleLogo,
  savedCount,
  currentUser,
  onOpenAuthModal,
}: NavigationProps) {
  const [showCursorMenu, setShowCursorMenu] = useState(false);

  const navItems: Array<{ id: NavPage; label: string }> = [
    { id: "home", label: "Home" },
    { id: "workspace", label: "Workspace" },
    { id: "dashboard", label: "Dashboard" },
    { id: "history", label: "History" },
    { id: "reports", label: "Reports" },
    { id: "models", label: "Models" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo with click to cycle 3D variant */}
          <div className="flex items-center gap-6">
            <AppLogo variant={logoVariant} onClick={onCycleLogo} />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-50 text-sky-600 border border-sky-200 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {/* Aerospace Reticle Cursor Toggle Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCursorMenu(!showCursorMenu)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  cursorEnabled
                    ? "bg-sky-50 border-sky-200 text-sky-700"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
                title="Configure 3D Satellite Reticle Cursor"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: cursorEnabled
                      ? CURSOR_THEMES[cursorThemeId].primary
                      : "#94a3b8",
                  }}
                />
                <span className="hidden sm:inline">Sat Reticle</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Cursor Settings Dropdown */}
              {showCursorMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 text-slate-900">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-bold font-mono text-slate-800">
                      SATELLITE CURSOR
                    </span>
                    <button
                      type="button"
                      onClick={onToggleCursor}
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        cursorEnabled
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {cursorEnabled ? "ENABLED" : "DISABLED"}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">Color Preset:</div>
                  <div className="space-y-1.5">
                    {(Object.keys(CURSOR_THEMES) as CursorThemeId[]).map((tid) => {
                      const t = CURSOR_THEMES[tid];
                      return (
                        <button
                          key={tid}
                          type="button"
                          onClick={() => {
                            onChangeCursorTheme(tid);
                            setShowCursorMenu(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                            cursorThemeId === tid
                              ? "bg-sky-50 text-sky-700 font-semibold border border-sky-200"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: t.primary }}
                          />
                          <div className="truncate">
                            <div>{t.name}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Launch Analysis Primary Button */}
            <button
              type="button"
              onClick={() => onNavigate("workspace")}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch</span>
            </button>

            {/* Authenticated Profile Chip OR Sign In / Sign Up Buttons */}
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100/80 text-left transition-all cursor-pointer group shadow-xs"
                title="View and Edit Analyst Profile Credentials"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="hidden sm:block leading-tight">
                  <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-1">
                    <span>{currentUser.name.split(" ")[0]}</span>
                    <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                    {currentUser.organization.split("/")[0].trim()}
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
