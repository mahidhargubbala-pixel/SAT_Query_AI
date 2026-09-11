import React from "react";
import { NavPage } from "../types";
import {
  Compass,
  LayoutDashboard,
  History,
  Bookmark,
  FileText,
  Cpu,
  Settings,
  Radio,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  savedCount: number;
  historyCount: number;
}

export function Sidebar({
  activePage,
  onNavigate,
  savedCount,
  historyCount,
}: SidebarProps) {
  const menuItems: Array<{
    id: NavPage;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
  }> = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: "workspace",
      label: "Analysis Workspace",
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: "history",
      label: "History Archive",
      icon: <History className="w-4 h-4" />,
      badge: historyCount > 0 ? historyCount : undefined,
    },
    {
      id: "reports",
      label: "Dossiers & Reports",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "models",
      label: "Model Registry",
      icon: <Cpu className="w-4 h-4" />,
    },
    {
      id: "settings",
      label: "Analyst Settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between p-4 hidden md:flex h-[calc(100vh-4rem)] sticky top-16 z-30 shadow-xs">
      {/* Navigation List (matches Screenshot 1) */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 font-sans">
          PLATFORM MENU
        </div>

        {menuItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-sky-50 text-sky-600 border border-sky-200 shadow-xs font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? "text-sky-600" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status Card (matches Screenshot 1 & 2) */}
      <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 text-xs shadow-xs font-sans">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-700 tracking-wide font-mono">
              ISRO / ESA PIPELINE
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold font-mono">
            ONLINE
          </span>
        </div>
        <div className="text-slate-800 font-bold text-[11px] mb-0.5">
          BigEarthNet PEFT Engine
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Fast multimodal inference with LoRA adapters online.
        </p>
      </div>
    </aside>
  );
}
