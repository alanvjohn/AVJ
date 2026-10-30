import { useEffect, useRef } from "react";
import "./GradientASCII.css";

const characters = " .·:+*#@";

function GradientASCII() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let pointer = { x: 0.72, y: 0.45, active: false };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      columns = Math.ceil(width / 15);
      rows = Math.ceil(height / 18);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      context.font = "12px monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = (column + 0.5) * (width / columns);
          const y = (row + 0.5) * (height / rows);
          const distance = Math.hypot(
            x / width - pointer.x,
            (y / height - pointer.y) * 0.8
          );
          const glow = Math.max(0, 1 - distance * 2.2);
          const wave = reducedMotion.matches ? 0 : Math.sin(time / 1600 + column * 0.22) * 0.08;
          const intensity = Math.max(0, glow + wave);
          const characterIndex = Math.min(
            characters.length - 1,
            Math.floor(intensity * characters.length)
          );

          if (characterIndex === 0) continue;

          context.fillStyle = `rgba(139, 185, 255, ${0.12 + intensity * 0.48})`;
          context.fillText(characters[characterIndex], x, y);
        }
      }

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
        active: true,
      };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="gradient-ascii" aria-hidden="true" />;
}

export default GradientASCII;
