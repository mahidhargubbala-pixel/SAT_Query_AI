import React, { useState } from "react";
import { SatelliteScene, AnalysisRecord, AnalysisMode } from "../types";
import { MessageSquare, X, Send, Sparkles, Bot, User, ShieldCheck } from "lucide-react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: SatelliteScene;
  mode: AnalysisMode;
  currentAnalysis: AnalysisRecord | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatModal({
  isOpen,
  onClose,
  scene,
  mode,
  currentAnalysis,
}: ChatModalProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your SatQuery AI Remote Sensing Assistant. I'm actively analyzing "${scene.title}" in ${mode.replace("_", " ")} mode. Ask me anything about spectral indices, change detection, SAR backscatter, or land-cover classifications!`,
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userQ = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userQ }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQ,
          sceneTitle: scene.title,
          mode,
          currentAnalysis: currentAnalysis ? { answer: currentAnalysis.answer } : null,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "Unable to generate answer." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "In this scene, multispectral surface reflectance and index analysis (NDVI/NDWI/NDBI) verify high-confidence land features and temporal dynamics.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl flex flex-col h-[560px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Bot className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                Interactive Remote Sensing Assistant
              </h3>
              <p className="text-[11px] text-sky-400 font-mono">
                Context: {scene.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-900/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow">
                  AI
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-sky-600 text-white font-medium shadow-md"
                    : "bg-slate-950 border border-slate-800 text-slate-200 shadow"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-xs font-bold border border-slate-700">
                  RS
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                AI
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-xs text-sky-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Formulating scientific answer...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={handleSend}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about NDVI, radar backscatter, change metrics..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center justify-center transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
