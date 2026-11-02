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
    let grid = { columns: 0, rows: 0, spacing: 0, columnsData: [], rowsData: [] };
    let grainPoints = [];

    const rebuildGrid = () => {
      const columns = Math.max(18, Math.floor(width / Math.max(5, cellSize * voxelSize * (1.15 - density * 0.35))));
      const rows = Math.max(12, Math.floor(height / Math.max(6, cellSize * voxelSize)));
      const horizonY = height * horizon;
      const spacing = width / columns;
      const columnsData = Array.from({ length: columns }, (_, column) => ({
        x: column * spacing + spacing / 2,
        wavePhase: column * (0.25 + waveLength),
        turbulencePhase: column * 0.22,
      }));
      const rowsData = Array.from({ length: rows }, (_, row) => {
        const depth = row / rows;
        const scale = 0.35 + depth * 1.25;
        const yBase = horizonY + Math.pow(depth, 1.2 + curvature) * height * 0.62;
        const size = Math.max(1, spacing * (0.3 + voxelSize * 0.55) * scale);
        const light = Math.min(100, 25 + depth * 45 + brightness * 22);
        const baseAlpha = Math.min(1, 0.2 + depth * 0.65 + haze * 0.12);
        const mix = Math.min(1, depth * 0.7);
        const red = Math.round(primary.r + (highlight.r - primary.r) * mix);
        const green = Math.round(primary.g + (highlight.g - primary.g) * mix);
        const blue = Math.round(primary.b + (highlight.b - primary.b) * mix);
        return {
          depth,
          scale,
          yBase,
          size,
          radius: Math.min(size / 2, roundness * size / 2),
          baseAlpha: baseAlpha * (light / 75),
          baseStyle: `rgba(${red}, ${green}, ${blue}, ${baseAlpha * (light / 75)})`,
        };
      });
      grid = { columns, rows, spacing, columnsData, rowsData };

      const grainCount = Math.floor(width * height * 0.00004);
      grainPoints = Array.from({ length: grainCount }, (_, index) => [
        (index * 47) % width,
        (index * 83) % height,
      ]);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      rebuildGrid();
    };

    const draw = (time) => {
      const elapsed = (time - startTime) / 1000;
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
      const { columns, rows, columnsData, rowsData } = grid;
      const horizonY = height * horizon;
      const motion = paused || reducedMotion ? 0 : speed;
      const introProgress = intro ? Math.min(1, elapsed * 0.65) : 1;
      context.shadowBlur = 0;

      for (let row = 0; row < rows; row += 1) {
        const rowData = rowsData[row];
        const {
          depth, scale, yBase, size, radius, baseAlpha, baseStyle,
        } = rowData;
        for (let column = 0; column < columns; column += 1) {
          const columnData = columnsData[column];
          const { x, wavePhase, turbulencePhase } = columnData;
          const wave = Math.sin(wavePhase + elapsed * motion * 2.4) * waveHeight * scale * 8;
          const turbulenceWave = Math.sin(row * 0.7 + turbulencePhase + elapsed * motion * 1.5) * turbulence * scale * 5;
          const pointerRipple = interactive && pointer.active
            ? Math.max(0, 1 - Math.hypot(x / width - pointer.x, depth - pointer.y) * 4) * ripples
            : 0;
          const mix = Math.min(1, depth * 0.7 + pointerRipple * 0.35);
          if (pointerRipple > 0 || introProgress < 1) {
            const red = Math.round(primary.r + (highlight.r - primary.r) * mix);
            const green = Math.round(primary.g + (highlight.g - primary.g) * mix);
            const blue = Math.round(primary.b + (highlight.b - primary.b) * mix);
            const light = Math.min(100, 25 + depth * 45 + brightness * 22 + pointerRipple * 26);
            context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${Math.min(1, baseAlpha * introProgress * (light / (25 + depth * 45 + brightness * 22)))})`;
          } else {
            context.fillStyle = baseStyle;
          }
          const offset = (wave + turbulenceWave) * tilt;
          if (radius > 0) {
            context.beginPath();
            context.roundRect(x - size / 2, yBase + offset - size / 2, size, size, radius);
            context.fill();
          } else {
            context.fillRect(x - size / 2, yBase + offset - size / 2, size, size);
          }
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
        for (const [x, y] of grainPoints) {
          context.fillRect(x, y, 1, 1);
        }
      }
      if (!paused && !reducedMotion && !document.hidden) frameId = requestAnimationFrame(draw);
    };

    const handlePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      pointer.active = true;
      if (event.pointerType === "touch" && canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }
    };
    const clearPointer = (event) => {
      pointer.active = false;
      if (event?.pointerId !== undefined && canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    const handleVisibility = () => {
      cancelAnimationFrame(frameId);
      if (!document.hidden && !paused && !reducedMotion) frameId = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerdown", handlePointer);
    canvas.addEventListener("pointerup", clearPointer);
    canvas.addEventListener("pointercancel", clearPointer);
    canvas.addEventListener("pointerleave", clearPointer);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerdown", handlePointer);
      canvas.removeEventListener("pointerup", clearPointer);
      canvas.removeEventListener("pointercancel", clearPointer);
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
