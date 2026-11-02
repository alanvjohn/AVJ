import { useEffect, useRef } from "react";
import "./VoxelArc.css";

function VoxelArc({ interactive = true, paused = false, className = "" }) {
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
      context.clearRect(0, 0, width, height);
      const columns = Math.max(22, Math.floor(width / 18));
      const rows = Math.max(12, Math.floor(height / 16));
      const horizon = height * 0.48;
      const spacing = width / columns;

      for (let row = 0; row < rows; row += 1) {
        const depth = row / rows;
        const y = horizon + Math.pow(depth, 1.65) * height * 0.6;
        const scale = 0.35 + depth * 1.2;
        for (let column = 0; column < columns; column += 1) {
          const x = column * spacing + spacing / 2;
          const wave = Math.sin(column * 0.7 + elapsed * (paused || reducedMotion ? 0 : 1.6)) * 5;
          const ripple = pointer.active && interactive
            ? Math.max(0, 1 - Math.hypot(x / width - pointer.x, depth - pointer.y) * 3)
            : 0;
          const size = Math.max(1.5, (1.4 + depth * 3) * scale);
          const brightness = 35 + depth * 55 + ripple * 45;
          context.fillStyle = `hsla(${205 + ripple * 35}, 90%, ${brightness}%, ${0.22 + depth * 0.58})`;
          context.fillRect(x - size / 2, y + wave - size / 2, size, size);
        }
      }

      const glow = context.createLinearGradient(0, horizon - 20, 0, horizon + 60);
      glow.addColorStop(0, "rgba(91, 194, 255, 0)");
      glow.addColorStop(0.5, "rgba(91, 194, 255, 0.32)");
      glow.addColorStop(1, "rgba(91, 194, 255, 0)");
      context.fillStyle = glow;
      context.fillRect(0, horizon - 20, width, 80);

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
  }, [interactive, paused]);

  return <canvas ref={canvasRef} className={`voxel-arc ${className}`} aria-label="Animated voxel arc background" />;
}

export default VoxelArc;
