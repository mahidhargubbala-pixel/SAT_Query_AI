import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function SatelliteHero3D({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(12, 10, 15);
    scene.add(sunLight);

    const rimLight = new THREE.PointLight(0x0ea5e9, 2.5, 30);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    // Earth Sphere
    const earthRadius = 4.2;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);

    // Initial photorealistic gradient/continent procedural texture while texture loads
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Deep oceanic gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
      oceanGrad.addColorStop(0, "#082f49");
      oceanGrad.addColorStop(0.5, "#0369a1");
      oceanGrad.addColorStop(1, "#082f49");
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Realistic landmass pigments (vegetation, arid land, mountains)
      ctx.fillStyle = "#1e3a2b";
      // Eurasia & Africa detailed continents
      ctx.beginPath();
      ctx.ellipse(540, 200, 160, 90, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#45331d"; // Sahara / arid
      ctx.beginPath();
      ctx.ellipse(520, 250, 100, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1e3a2b"; // Central Africa
      ctx.beginPath();
      ctx.ellipse(540, 310, 70, 80, 0, 0, Math.PI * 2);
      ctx.fill();
      // Indian Subcontinent
      ctx.beginPath();
      ctx.ellipse(660, 240, 45, 55, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Americas (North and South)
      ctx.fillStyle = "#273f2b";
      ctx.beginPath();
      ctx.ellipse(260, 180, 100, 80, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(320, 340, 60, 120, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Australia
      ctx.fillStyle = "#4a3525";
      ctx.beginPath();
      ctx.ellipse(780, 360, 55, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric cloud wisps
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      for (let i = 0; i < 15; i++) {
        const cx = 50 + (i * 68) % 1000;
        const cy = 100 + (i * 37) % 320;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 80 + (i % 5) * 15, 20 + (i % 4) * 8, 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const fallbackTexture = new THREE.CanvasTexture(canvas);
    const earthMat = new THREE.MeshStandardMaterial({
      map: fallbackTexture,
      roughness: 0.65,
      metalness: 0.1,
      color: 0xffffff,
    });

    // Load authentic NASA Blue Marble satellite imagery texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin("anonymous");
    textureLoader.load(
      "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        earthMat.map = texture;
        earthMat.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback already assigned
      }
    );

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // Atmosphere Glow Shell
    const atmoGeo = new THREE.SphereGeometry(earthRadius * 1.04, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmoMesh);

    // Orbital Path Ring
    const orbitRadius = 7.4;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.92, 0, 2 * Math.PI, false, 0);
    const points = orbitCurve.getPoints(100);
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(
      points.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
    const orbitMat = new THREE.LineBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.45,
    });
    const orbitLine = new THREE.Line(orbitGeo, orbitMat);
    orbitLine.rotation.x = Math.PI / 4.2;
    orbitLine.rotation.z = Math.PI / 7;
    scene.add(orbitLine);

    // Satellite Group Model
    const satGroup = new THREE.Group();

    // Satellite Central Bus
    const busGeo = new THREE.BoxGeometry(0.7, 0.7, 1.2);
    const busMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25,
    });
    const bus = new THREE.Mesh(busGeo, busMat);
    satGroup.add(bus);

    // Solar Wings Left & Right
    const wingGeo = new THREE.BoxGeometry(2.4, 0.05, 0.9);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x0369a1,
      emissiveIntensity: 0.2,
    });
    const wingLeft = new THREE.Mesh(wingGeo, wingMat);
    wingLeft.position.set(-1.6, 0, 0);
    satGroup.add(wingLeft);

    const wingRight = new THREE.Mesh(wingGeo, wingMat);
    wingRight.position.set(1.6, 0, 0);
    satGroup.add(wingRight);

    // Optical Sensor Aperture / Camera Lens
    const lensGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.35, 16);
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.95,
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, -0.45, 0);
    satGroup.add(lens);

    // Communication Dish Antenna
    const dishGeo = new THREE.SphereGeometry(0.35, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.7,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0, 0.45, 0.4);
    dish.rotation.x = Math.PI * 1.2;
    satGroup.add(dish);

    satGroup.scale.set(0.65, 0.65, 0.65);
    scene.add(satGroup);

    // Starfield Particle Background
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50;
      starPositions[i + 1] = (Math.random() - 0.5) * 50;
      starPositions[i + 2] = -10 + (Math.random() - 0.5) * 30;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Animation Loop
    let angle = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate Earth slowly
      earthMesh.rotation.y += 0.0018;

      // Orbit Satellite
      angle += 0.0085;
      const x = Math.cos(angle) * orbitRadius;
      const z = Math.sin(angle) * (orbitRadius * 0.92);

      // Apply orbit tilt
      const tiltedY = -x * Math.sin(Math.PI / 7) + z * Math.sin(Math.PI / 4.2) * 0.5;
      const tiltedX = x * Math.cos(Math.PI / 7);
      const tiltedZ = z * Math.cos(Math.PI / 4.2);

      satGroup.position.set(tiltedX, tiltedY, tiltedZ);
      satGroup.rotation.y = -angle;
      satGroup.rotation.z = Math.sin(angle * 2) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-[380px] sm:h-[440px] flex items-center justify-center overflow-hidden ${className}`}>
      {/* 3D Canvas container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Orbit Telemetry HUD Card (Matches screenshot 1 & 2 aesthetic) */}
      <div className="absolute bottom-4 left-4 sm:left-6 z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 shadow-xl text-left max-w-xs pointer-events-none">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold text-sky-400 tracking-wider">
            ORBIT TELEMETRY LIVE
          </span>
        </div>
        <div className="text-xs font-bold text-white mb-0.5">Sentinel-2A/B Polar Orbit</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] font-mono text-slate-300">
          <div>Alt: <span className="text-white font-bold">786 km</span></div>
          <div>Inc: <span className="text-white font-bold">98.62° SSO</span></div>
          <div>GSD: <span className="text-sky-400 font-bold">10m Opt</span></div>
          <div>Cycle: <span className="text-white font-bold">5 Days</span></div>
        </div>
      </div>
    </div>
  );
}
