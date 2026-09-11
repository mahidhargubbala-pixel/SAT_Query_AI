import React, { useEffect, useRef, useState } from "react";
import { CursorThemeId } from "../types";

export interface CursorThemeConfig {
  id: CursorThemeId;
  name: string;
  tag: string;
  primary: string;
  glow: string;
  trailRgba: string;
}

export const CURSOR_THEMES: Record<CursorThemeId, CursorThemeConfig> = {
  "azure-fluid": {
    id: "azure-fluid",
    name: "Aerospace Azure",
    tag: "Sentinel-2 Multi-Spectral",
    primary: "#0284c7",
    glow: "rgba(2, 132, 199, 0.4)",
    trailRgba: "2, 132, 199",
  },
  "solar-gold": {
    id: "solar-gold",
    name: "Solar Array Amber",
    tag: "Photovoltaic Telemetry",
    primary: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.4)",
    trailRgba: "245, 158, 11",
  },
  "aurora-emerald": {
    id: "aurora-emerald",
    name: "Aurora Polar Emerald",
    tag: "Geomagnetic Sweep",
    primary: "#10b981",
    glow: "rgba(16, 185, 129, 0.4)",
    trailRgba: "16, 185, 129",
  },
  "quantum-violet": {
    id: "quantum-violet",
    name: "Deep Space Violet",
    tag: "Deep Orbit Sensor",
    primary: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.4)",
    trailRgba: "139, 92, 246",
  },
};

interface KineticCursorProps {
  enabled: boolean;
  themeId?: CursorThemeId;
}

interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

export function KineticCursor({ enabled, themeId = "azure-fluid" }: KineticCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -100, y: -100, isHovered: false, isClicking: false });
  const trailRef = useRef<TrailPoint[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const theme = CURSOR_THEMES[themeId] || CURSOR_THEMES["azure-fluid"];

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;

      // Add trail point with smooth spacing
      const last = trailRef.current[trailRef.current.length - 1];
      if (!last || Math.hypot(e.clientX - last.x, e.clientY - last.y) > 6) {
        trailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          alpha: 1.0,
        });
        // Limit trail length to keep it clean and non-distracting
        if (trailRef.current.length > 12) {
          trailRef.current.shift();
        }
      }

      const target = e.target as HTMLElement | null;
      mouseRef.current.isHovered = !!(
        target?.closest("button") ||
        target?.closest("a") ||
        target?.closest("input") ||
        target?.closest(".cursor-pointer") ||
        target?.closest("[data-satellite-viewer]")
      );
    };

    const handleMouseDown = () => {
      mouseRef.current.isClicking = true;
    };
    const handleMouseUp = () => {
      mouseRef.current.isClicking = false;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -100;
      mouseRef.current.y = -100;
      trailRef.current = [];
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Render loop for smooth, visible, yet text-friendly cursor trail
    let currentX = mouseRef.current.x;
    let currentY = mouseRef.current.y;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth cursor interpolation
      currentX += (mouseRef.current.x - currentX) * 0.45;
      currentY += (mouseRef.current.y - currentY) * 0.45;

      // 1. Draw Visible Aerospace Trail (Fades quickly when still so text is never disturbed)
      const pts = trailRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].alpha *= 0.88; // Gentle fade
        if (pts[i].alpha < 0.05) {
          pts.splice(i, 1);
        }
      }

      if (pts.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);

        for (let i = 1; i < pts.length; i++) {
          const xc = (pts[i].x + pts[i - 1].x) / 2;
          const yc = (pts[i].y + pts[i - 1].y) / 2;
          ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, xc, yc);
        }
        ctx.lineTo(currentX, currentY);

        // Soft gradient stroke for visible, elegant trail
        ctx.strokeStyle = `rgba(${theme.trailRgba}, 0.35)`;
        ctx.lineWidth = mouseRef.current.isHovered ? 2.5 : 1.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        // Draw soft glowing particle nodes along the trail
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          const radius = (i / pts.length) * 2.2 + 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${theme.trailRgba}, ${p.alpha * 0.4})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Draw Satellite Targeting Reticle at current position
      if (currentX > 0 && currentY > 0) {
        ctx.save();
        const isHov = mouseRef.current.isHovered;
        const isClick = mouseRef.current.isClicking;
        const radius = isClick ? 8 : isHov ? 12 : 9;

        // Outer Reticle Ring
        ctx.beginPath();
        ctx.arc(currentX, currentY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isHov ? `rgba(${theme.trailRgba}, 0.8)` : `rgba(${theme.trailRgba}, 0.5)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Center Sensor Dot
        ctx.beginPath();
        ctx.arc(currentX, currentY, isClick ? 3 : 2, 0, Math.PI * 2);
        ctx.fillStyle = theme.primary;
        ctx.shadowColor = theme.primary;
        ctx.shadowBlur = 4;
        ctx.fill();

        // 4 Precision Crosshair Ticks (subtle aerospace style)
        const tickDist = radius + 3;
        const tickLen = 2.5;
        ctx.strokeStyle = `rgba(${theme.trailRgba}, 0.6)`;
        ctx.lineWidth = 1;

        // Top tick
        ctx.beginPath();
        ctx.moveTo(currentX, currentY - tickDist);
        ctx.lineTo(currentX, currentY - tickDist - tickLen);
        ctx.stroke();

        // Bottom tick
        ctx.beginPath();
        ctx.moveTo(currentX, currentY + tickDist);
        ctx.lineTo(currentX, currentY + tickDist + tickLen);
        ctx.stroke();

        // Left tick
        ctx.beginPath();
        ctx.moveTo(currentX - tickDist, currentY);
        ctx.lineTo(currentX - tickDist - tickLen, currentY);
        ctx.stroke();

        // Right tick
        ctx.beginPath();
        ctx.moveTo(currentX + tickDist, currentY);
        ctx.lineTo(currentX + tickDist + tickLen, currentY);
        ctx.stroke();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, theme]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 select-none"
      style={{ pointerEvents: "none" }}
    />
  );
}
