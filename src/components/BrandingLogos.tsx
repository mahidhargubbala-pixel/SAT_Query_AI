import React, { useEffect, useRef } from "react";
import { LogoVariantId } from "../types";

export interface LogoMetadata {
  id: LogoVariantId;
  name: string;
  subtitle: string;
  description: string;
}

export const LOGO_VARIANTS_METADATA: LogoMetadata[] = [
  {
    id: "orbital-radar",
    name: "3D Orbital Radar Aperture",
    subtitle: "3D rotating Earth globe with tilted orbital satellite tracking",
    description: "Animated 3D planetary sphere with specular lighting and revolving satellite transceiver.",
  },
  {
    id: "hex-sensor",
    name: "3D Hex-Sensor Sentinel",
    subtitle: "3D spinning faceted satellite chassis with solar wings",
    description: "Isometric 3D satellite model with dual solar arrays and pulsed target beam.",
  },
  {
    id: "quantum-horizon",
    name: "3D Quantum Earth Horizon",
    subtitle: "3D planetary limb with ionospheric glow & sensor sweep",
    description: "Curved 3D planetary body with real-time solar glare and atmospheric scanning arc.",
  },
  {
    id: "prism-band",
    name: "3D Multispectral Prism",
    subtitle: "3D optical refraction prism with multispectral beams",
    description: "Rotating 3D crystalline sensor separating VIS/NIR/SWIR spectral wavelengths.",
  },
  {
    id: "sar-phased",
    name: "3D SAR Phased Array Dish",
    subtitle: "3D gimbal microwave antenna with radar pulse rings",
    description: "Gimballed 3D radar parabolic receiver emitting coherent C-band microwave pulses.",
  },
  {
    id: "tri-constellation",
    name: "3D Tri-Satellite Swarm",
    subtitle: "3D multi-satellite constellation with inter-orbit links",
    description: "Three synchronized 3D satellites revolving around Earth with active laser telemetry.",
  },
];

interface LogoProps {
  variant?: LogoVariantId;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  showText?: boolean;
}

export function LogoEmblem({
  variant = "orbital-radar",
  size = "md",
}: {
  variant: LogoVariantId;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic dimensions based on size
  const pxSize = size === "sm" ? 32 : size === "md" ? 42 : size === "lg" ? 54 : 64;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += 0.028;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = w * 0.38;

      ctx.clearRect(0, 0, w, h);

      if (variant === "orbital-radar") {
        // 1. 3D ORBITAL RADAR SPHERE
        // Outer 3D atmosphere halo
        const haloGrad = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 1.25);
        haloGrad.addColorStop(0, "rgba(56, 189, 248, 0.2)");
        haloGrad.addColorStop(0.7, "rgba(2, 132, 199, 0.15)");
        haloGrad.addColorStop(1, "rgba(2, 132, 199, 0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
        ctx.fill();

        // 3D Globe with specular highlight (Simulated 3D sphere)
        const sphereGrad = ctx.createRadialGradient(
          cx - r * 0.35,
          cy - r * 0.35,
          r * 0.1,
          cx,
          cy,
          r
        );
        sphereGrad.addColorStop(0, "#bae6fd");
        sphereGrad.addColorStop(0.3, "#0284c7");
        sphereGrad.addColorStop(0.75, "#0369a1");
        sphereGrad.addColorStop(1, "#082f49");

        ctx.save();
        ctx.shadowColor = "rgba(14, 165, 233, 0.6)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3D Latitude / Longitude lines rotating
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.clip();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;

        // Rotating longitudinal arcs
        for (let i = -1; i <= 1; i += 0.6) {
          const shift = (angle + i * Math.PI) % (Math.PI * 2);
          const xOffset = Math.sin(shift) * r;
          ctx.beginPath();
          ctx.ellipse(cx + xOffset * 0.7, cy, Math.abs(xOffset) * 0.35 + 2, r, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Equator
        ctx.beginPath();
        ctx.ellipse(cx, cy, r, r * 0.35, -0.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3D Tilted Orbit Ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.4);

        ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.45, r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Revolving 3D Satellite with solar wings
        const satAngle = angle * 1.4;
        const satX = Math.cos(satAngle) * r * 1.45;
        const satY = Math.sin(satAngle) * r * 0.55;

        // Satellite body
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(satX, satY, 3, 0, Math.PI * 2);
        ctx.fill();

        // Mini solar wings
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(satX - 5, satY);
        ctx.lineTo(satX + 5, satY);
        ctx.stroke();

        ctx.restore();
      } else if (variant === "hex-sensor") {
        // 2. 3D HEXAGONAL FACETED SATELLITE
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle * 0.8);

        // 3D isometric cube / hexagon
        const hexR = r * 0.85;
        ctx.fillStyle = "#0284c7";
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const x = Math.cos(a) * hexR;
          const y = Math.sin(a) * hexR;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        // Facet shading
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(0) * hexR, Math.sin(0) * hexR);
        ctx.lineTo(Math.cos(Math.PI / 3) * hexR, Math.sin(Math.PI / 3) * hexR);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#0369a1";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos((2 * Math.PI) / 3) * hexR, Math.sin((2 * Math.PI) / 3) * hexR);
        ctx.lineTo(Math.cos(Math.PI) * hexR, Math.sin(Math.PI) * hexR);
        ctx.closePath();
        ctx.fill();

        // Central sensor aperture
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Laser beam pulse
        ctx.restore();
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + Math.sin(angle * 4) * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
        ctx.stroke();
      } else if (variant === "quantum-horizon") {
        // 3. 3D PLANETARY LIMB & CORONA
        const grad = ctx.createRadialGradient(cx - r * 0.6, cy + r * 0.8, 5, cx, cy, r * 1.2);
        grad.addColorStop(0, "#38bdf8");
        grad.addColorStop(0.4, "#0284c7");
        grad.addColorStop(0.8, "#0f172a");
        grad.addColorStop(1, "#020617");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.4, r, Math.PI, Math.PI * 2);
        ctx.fill();

        // 3D atmosphere rim
        ctx.strokeStyle = "#7dd3fc";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.4, r, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Scanning orbital sweep ray
        const rayAngle = Math.PI + (Math.sin(angle * 1.5) * 0.5 + 0.5) * Math.PI;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.4);
        ctx.lineTo(cx + Math.cos(rayAngle) * (r * 1.3), (cy + r * 0.4) + Math.sin(rayAngle) * (r * 1.3));
        ctx.stroke();
      } else if (variant === "prism-band") {
        // 4. 3D MULTISPECTRAL PRISM
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(angle * 0.8) * 0.3);

        // Glass Prism
        ctx.fillStyle = "rgba(2, 132, 199, 0.3)";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.8);
        ctx.lineTo(-r * 0.7, r * 0.7);
        ctx.lineTo(r * 0.7, r * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Multi-color refractions
        const colors = ["#ef4444", "#22c55e", "#0ea5e9", "#a855f7"];
        colors.forEach((c, idx) => {
          ctx.strokeStyle = c;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(r * 1.1, (idx - 1.5) * 8);
          ctx.stroke();
        });
        ctx.restore();
      } else if (variant === "sar-phased") {
        // 5. 3D SAR MICROWAVE DISH
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.3 + Math.sin(angle) * 0.15);

        // Dish parabolic surface
        ctx.fillStyle = "#0284c7";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 0.9, r * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Feed horn
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r * 0.7);
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.arc(0, -r * 0.7, 3, 0, Math.PI * 2);
        ctx.fill();

        // Radar pulses expanding
        const pulseR = ((angle * 20) % (r * 1.2));
        ctx.strokeStyle = `rgba(245, 158, 11, ${1 - pulseR / (r * 1.2)})`;
        ctx.beginPath();
        ctx.arc(0, -r * 0.7, pulseR, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();

        ctx.restore();
      } else {
        // 6. 3D TRI-CONSTELLATION
        ctx.fillStyle = "#0369a1";
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 3; i++) {
          const satA = angle + (i * Math.PI * 2) / 3;
          const sx = cx + Math.cos(satA) * (r * 0.9);
          const sy = cy + Math.sin(satA) * (r * 0.9);

          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [variant]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={pxSize * 2}
        height={pxSize * 2}
        style={{ width: pxSize, height: pxSize }}
        className="block shrink-0 drop-shadow-md"
      />
    </div>
  );
}

export function AppLogo({
  variant = "orbital-radar",
  size = "md",
  className = "",
  onClick,
  showText = true,
}: LogoProps) {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
      title="Click to switch 3D Satellite Logo Variant"
    >
      <LogoEmblem variant={variant} size={size} />

      {showText && (
        <div className="flex items-center gap-1.5 font-black tracking-tight">
          <span className="text-slate-900 font-extrabold text-base sm:text-lg tracking-normal">
            SAT
          </span>
          <span className="text-slate-400 font-normal">·</span>
          <span className="text-sky-600 font-black text-base sm:text-lg tracking-normal">
            QUERY
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-sky-600 text-white font-mono text-[10px] font-bold tracking-wider ml-0.5 shadow-sm">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
