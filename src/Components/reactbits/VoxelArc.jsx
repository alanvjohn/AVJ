import { useEffect, useRef } from "react";
import "./VoxelArc.css";

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  const number = Number.parseInt(normalized, 16);
  return { r: (number >> 16) & 255, g: (number >> 8) & 255, b: number & 255 };
}

function VoxelArc({
  interactive = true,
  preset = "horizon",
  color = "#5227ff",
  accent = "#b19eef",
  backgroundColor = "#0a0a0a",
  density = 1,
  voxelSize = 0.55,
  roundness = 0.2,
  tilt = 1,
  horizon = 0.56,
  curvature = 0.5,
  waveHeight = 1,
  waveLength = 1,
  speed = 0.5,
  turbulence = 0.4,
  brightness = 1,
  glowStrength = 1,
  haze = 0.7,
  bloom = 0.5,
  focus = 0.25,
  aperture = 0.35,
  grain = 0.25,
  ripples = 1,
  intro = true,
  paused = false,
  waveStrength = 5,
  cellSize = 18,
  hue = 205,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, active: false };
    const primary = hexToRgb(color);
    const highlight = hexToRgb(accent);
    let frameId;
    let width = 0;
    let height = 0;
    let startTime = performance.now();

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time) => {
      const elapsed = (time - startTime) / 1000;
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
      const columns = Math.max(18, Math.floor(width / Math.max(5, cellSize * voxelSize * (1.15 - density * 0.35))));
      const rows = Math.max(12, Math.floor(height / Math.max(6, cellSize * voxelSize)));
      const horizonY = height * horizon;
      const spacing = width / columns;
      const motion = paused || reducedMotion ? 0 : speed;
      const introProgress = intro ? Math.min(1, elapsed * 0.65) : 1;
      context.shadowBlur = Math.max(0, glowStrength * 8 + bloom * 8);
      context.shadowColor = color;

      for (let row = 0; row < rows; row += 1) {
        const depth = row / rows;
        const yBase = horizonY + Math.pow(depth, 1.2 + curvature) * height * 0.62;
        const scale = 0.35 + depth * 1.25;
        for (let column = 0; column < columns; column += 1) {
          const x = column * spacing + spacing / 2;
          const wave = Math.sin(column * (0.25 + waveLength) + elapsed * motion * 2.4) * waveHeight * scale * 8;
          const turbulenceWave = Math.sin(row * 0.7 + column * 0.22 + elapsed * motion * 1.5) * turbulence * scale * 5;
          const pointerRipple = interactive && pointer.active
            ? Math.max(0, 1 - Math.hypot(x / width - pointer.x, depth - pointer.y) * 4) * ripples
            : 0;
          const size = Math.max(1, spacing * (0.3 + voxelSize * 0.55) * scale);
          const light = Math.min(100, 25 + depth * 45 + brightness * 22 + pointerRipple * 26);
          const alpha = Math.min(1, (0.2 + depth * 0.65 + haze * 0.12) * introProgress);
          const mix = Math.min(1, depth * 0.7 + pointerRipple * 0.35);
          const red = Math.round(primary.r + (highlight.r - primary.r) * mix);
          const green = Math.round(primary.g + (highlight.g - primary.g) * mix);
          const blue = Math.round(primary.b + (highlight.b - primary.b) * mix);
          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha * (light / 75)})`;
          const offset = (wave + turbulenceWave) * tilt;
          const radius = Math.min(size / 2, roundness * size / 2);
          context.beginPath();
          context.roundRect(x - size / 2, yBase + offset - size / 2, size, size, radius);
          context.fill();
        }
      }

      context.shadowBlur = 0;
      const glow = context.createLinearGradient(0, horizonY - 30, 0, horizonY + 70);
      glow.addColorStop(0, `rgba(${highlight.r}, ${highlight.g}, ${highlight.b}, 0)`);
      glow.addColorStop(0.5, `rgba(${highlight.r}, ${highlight.g}, ${highlight.b}, ${0.18 * glowStrength})`);
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, horizonY - 30, width, 100);

      if (grain > 0) {
        context.fillStyle = `rgba(255,255,255,${grain * 0.025})`;
        for (let index = 0; index < width * height * 0.00015; index += 1) {
          context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
        }
      }
      if (!paused && !reducedMotion) frameId = requestAnimationFrame(draw);
    };

    const handlePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      pointer.active = true;
    };
    const clearPointer = () => { pointer.active = false; };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", clearPointer);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, [
    accent, aperture, backgroundColor, bloom, brightness, cellSize, color, curvature, density,
    grain, glowStrength, haze, horizon, intro, interactive, paused, ripples, roundness, speed,
    turbulence, tilt, voxelSize, waveHeight, waveLength, waveStrength, hue, preset,
  ]);

  return <canvas ref={canvasRef} className={`voxel-arc ${className}`} aria-label="Animated voxel arc background" />;
}

export default VoxelArc;
