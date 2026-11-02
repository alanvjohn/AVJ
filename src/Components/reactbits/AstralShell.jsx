import { useEffect, useRef } from "react";
import "./AstralShell.css";

function AstralShell({
  interactive = true,
  paused = false,
  pointCount = 150,
  rotationSpeed = 0.0025,
  globeScale = 0.32,
  lineOpacity = 1,
  className = "",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0.5, y: 0.5, active: false };
    let frameId;
    let width = 0;
    let height = 0;
    let rotation = 0;
    const points = Array.from({ length: pointCount }, (_, index) => {
      const phi = Math.acos(1 - (2 * (index + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;
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

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * globeScale;
      const centerX = width * 0.72;
      const centerY = height * 0.52;
      const projected = points.map((point) => {
        const angle = rotation + (interactive && pointer.active ? (pointer.x - 0.5) * 0.8 : 0);
        const x = point.x * Math.cos(angle) - point.z * Math.sin(angle);
        const z = point.x * Math.sin(angle) + point.z * Math.cos(angle);
        return {
          x: centerX + x * radius,
          y: centerY + point.y * radius,
          z,
        };
      });

      context.lineWidth = 0.7;
      for (let index = 0; index < projected.length; index += 1) {
        const current = projected[index];
        let nearest = null;
        let distance = Infinity;
        for (let targetIndex = 0; targetIndex < projected.length; targetIndex += 1) {
          if (targetIndex === index) continue;
          const target = projected[targetIndex];
          const nextDistance = (current.x - target.x) ** 2 + (current.y - target.y) ** 2;
          if (nextDistance < distance) {
            distance = nextDistance;
            nearest = target;
          }
        }
        if (nearest && distance < radius * radius * 0.14) {
          const alpha = Math.max(0.08, (current.z + 1) / 3);
          context.strokeStyle = `rgba(124, 107, 255, ${alpha * lineOpacity})`;
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(nearest.x, nearest.y);
          context.stroke();
        }
      }

      projected.forEach((point) => {
        const glow = interactive && pointer.active
          ? Math.max(0, 1 - Math.hypot(point.x / width - pointer.x, point.y / height - pointer.y) * 4)
          : 0;
        context.fillStyle = `rgba(${150 + glow * 90}, ${130 + glow * 80}, 255, ${0.25 + (point.z + 1) * 0.24 + glow * 0.5})`;
        context.beginPath();
        context.arc(point.x, point.y, 1.2 + glow * 2, 0, Math.PI * 2);
        context.fill();
      });

      if (!paused && !reducedMotion) {
        rotation += rotationSpeed;
        frameId = requestAnimationFrame(draw);
      }
    };

    const handlePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width;
      pointer.y = (event.clientY - bounds.top) / bounds.height;
      pointer.active = true;
    };
    const clearPointer = () => { pointer.active = false; };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerleave", clearPointer);
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, [globeScale, interactive, lineOpacity, paused, pointCount, rotationSpeed]);

  return <canvas ref={canvasRef} className={`astral-shell ${className}`} aria-label="Animated astral shell background" />;
}

export default AstralShell;
