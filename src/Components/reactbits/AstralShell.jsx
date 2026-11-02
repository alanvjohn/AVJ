import { useEffect, useRef } from "react";
import "./AstralShell.css";

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  const number = Number.parseInt(normalized, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function AstralShell({
  interactive = true,
  draggable = true,
  clickPulse = true,
  paused = false,
  backgroundColor = "#0a0a0a",
  networkColor = "#7c6bff",
  highlightColor = "#ffe6fa",
  pointCount = 150,
  connections = 4,
  reach = 0.2,
  clustering = 0.85,
  chords = 0.35,
  radius = 0.4,
  originX = 0.5,
  originY = 0.5,
  rotationSpeed = 0.0025,
  globeScale = 0.32,
  nodeSize = 0.8,
  depthFade = 0.7,
  lineOpacity = 1,
  spin = 1,
  tilt = 18,
  hoverRadius = 0.22,
  hoverBoost = 1,
  pulseSpeed = 1.2,
  seed = 0,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, active: false, dragging: false };
    const network = hexToRgb(networkColor);
    const highlight = hexToRgb(highlightColor);
    let frameId;
    let width = 0;
    let height = 0;
    let rotation = 0;
    let pulse = 0;
    let dragRotation = 0;
    let lastPointerX = 0.5;
    const random = (index) => {
      const value = Math.sin((index + 1 + seed) * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    };
    const points = Array.from({ length: pointCount }, (_, index) => {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index + random(index) * 0.35;
      return { x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta) };
    });

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time = 0) => {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
      const globeRadius = Math.min(width, height) * globeScale * radius * 2.5;
      const centerX = width * originX;
      const centerY = height * originY;
      const angle = rotation + dragRotation + (interactive && pointer.active ? (pointer.x - 0.5) * tilt / 90 : 0);
      const cosTilt = Math.cos(tilt * Math.PI / 180);
      const sinTilt = Math.sin(tilt * Math.PI / 180);
      const projected = points.map((point) => {
        const x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
        const z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
        return {
          x: centerX + x * globeRadius,
          y: centerY + (point.y * cosTilt - z * sinTilt) * globeRadius,
          z: point.y * sinTilt + z * cosTilt,
        };
      });

      context.lineWidth = 0.7;
      projected.forEach((current, index) => {
        const nearest = projected
          .map((target, targetIndex) => ({
            target,
            targetIndex,
            distance: (current.x - target.x) ** 2 + (current.y - target.y) ** 2,
          }))
          .filter(({ targetIndex }) => targetIndex !== index)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, connections);
        nearest.forEach(({ target, targetIndex, distance }) => {
          if (targetIndex < index || distance > globeRadius * globeRadius * (0.25 + reach)) return;
          const alpha = Math.max(0.03, (current.z + target.z + 2) / 4) * lineOpacity * clustering;
          context.strokeStyle = `rgba(${network.r}, ${network.g}, ${network.b}, ${alpha})`;
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.quadraticCurveTo(
            (current.x + target.x) / 2,
            (current.y + target.y) / 2 - chords * globeRadius * 0.12,
            target.x,
            target.y
          );
          context.stroke();
        });
      });

      projected.forEach((point) => {
        const distance = Math.hypot(point.x / width - pointer.x, point.y / height - pointer.y);
        const glow = interactive && pointer.active
          ? Math.max(0, 1 - distance / Math.max(0.02, hoverRadius)) * hoverBoost
          : 0;
        const pulseGlow = clickPulse ? (Math.sin(time * 0.001 * pulseSpeed + pulse) + 1) * 0.08 : 0;
        const alpha = Math.max(0.12, 1 - (1 - point.z) * depthFade * 0.65);
        context.fillStyle = `rgba(${Math.min(255, highlight.r + glow * 70)}, ${Math.min(255, highlight.g + glow * 70)}, ${Math.min(255, highlight.b + glow * 70)}, ${alpha})`;
        context.beginPath();
        context.arc(point.x, point.y, Math.max(0.5, nodeSize * (1.2 + glow * 2 + pulseGlow)), 0, Math.PI * 2);
        context.fill();
      });

      if (!paused && !reducedMotion) {
        rotation += rotationSpeed * spin;
        frameId = requestAnimationFrame(draw);
      }
    };

    const handlePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = (event.clientY - bounds.top) / bounds.height;
      if (draggable && pointer.dragging) dragRotation += pointer.x - lastPointerX;
      lastPointerX = pointer.x;
      pointer.active = true;
    };
    const handlePointerDown = (event) => {
      pointer.dragging = draggable;
      handlePointer(event);
      if (clickPulse) pulse += 1;
    };
    const handlePointerUp = () => { pointer.dragging = false; };
    const clearPointer = () => { pointer.active = false; pointer.dragging = false; };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", clearPointer);
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, [
    backgroundColor, chords, clickPulse, clustering, connections, depthFade, draggable,
    globeScale, highlightColor, hoverBoost, hoverRadius, interactive, lineOpacity, networkColor,
    nodeSize, originX, originY, paused, pointCount, pulseSpeed, radius, reach, rotationSpeed,
    seed, spin, tilt,
  ]);

  return <canvas ref={canvasRef} className={`astral-shell ${className}`} aria-label="Animated astral shell background" />;
}

export default AstralShell;
