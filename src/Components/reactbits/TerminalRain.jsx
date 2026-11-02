import { useEffect, useMemo, useRef } from "react";
import "./TerminalRain.css";

const defaultCharacters = "01アイウエオカキクケコ";

function TerminalRain({
  colors = ["#54c8ff", "#d7f7ff"],
  background = "#07111f",
  characters = defaultCharacters,
  fontSize = 18,
  density = 0.45,
  trailLength = 16,
  speed = 1,
  glow = 0.22,
  interactive = true,
  cascade = true,
  paused = false,
  resolution = 0.7,
  className = "",
}) {
  const canvasRef = useRef(null);
  const characterSet = useMemo(() => Array.from(characters || defaultCharacters), [characters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, active: false };
    const streams = [];
    let frameId;
    let width = 0;
    let height = 0;
    let columns = 0;
    let lastTime = performance.now();

    const randomChar = () => characterSet[Math.floor(Math.random() * characterSet.length)] || "0";
    const resetStream = (stream, startAbove = false) => {
      stream.x = Math.floor(Math.random() * Math.max(1, columns));
      stream.y = startAbove ? -Math.random() * height / fontSize : Math.random() * height / fontSize;
      stream.length = Math.max(4, trailLength + Math.round((Math.random() - 0.5) * 5));
      stream.speed = (0.65 + Math.random() * 0.7) * speed;
      stream.phase = Math.random() * Math.PI * 2;
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2) * Math.max(0.25, Math.min(1, resolution));
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      columns = Math.ceil(width / Math.max(10, fontSize));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const streamCount = Math.max(1, Math.floor(columns * Math.max(0.05, Math.min(1, density))));
      while (streams.length < streamCount) streams.push({});
      streams.length = streamCount;
      streams.forEach((stream) => resetStream(stream));
    };
    const draw = (time) => {
      const delta = Math.min(40, time - lastTime) / 16.67;
      lastTime = time;
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = "center";
      streams.forEach((stream) => {
        const x = stream.x * fontSize + fontSize / 2;
        const pointerDistance = interactive && pointer.active
          ? Math.hypot(x - pointer.x, stream.y * fontSize - pointer.y)
          : Infinity;
        const slowdown = pointerDistance < 170 ? 1 - (1 - pointerDistance / 170) * 0.6 : 1;
        stream.y += stream.speed * slowdown * delta;
        for (let index = 0; index < stream.length; index += 1) {
          const y = (stream.y - index) * fontSize;
          if (y < -fontSize || y > height + fontSize) continue;
          const progress = 1 - index / stream.length;
          context.globalAlpha = progress * 0.8;
          context.shadowBlur = index === 0 ? glow * 18 : 0;
          context.shadowColor = colors[1];
          context.fillStyle = index === 0 ? colors[1] : colors[0];
          context.fillText(randomChar(), x, y);
        }
        context.globalAlpha = 1;
        context.shadowBlur = 0;
        if (stream.y * fontSize - stream.length * fontSize > height) resetStream(stream, true);
      });
      if (!paused && !reducedMotion) frameId = requestAnimationFrame(draw);
    };
    const handlePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
      if (cascade && event.type === "pointerdown") {
        streams.slice(0, 3).forEach((stream) => {
          stream.x = Math.floor(pointer.x / Math.max(10, fontSize)) + Math.round((Math.random() - 0.5) * 4);
          stream.y = pointer.y / fontSize;
        });
      }
    };
    const clearPointer = () => { pointer.active = false; };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointer);
    canvas.addEventListener("pointerdown", handlePointer);
    canvas.addEventListener("pointerleave", clearPointer);
    draw(performance.now());
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointer);
      canvas.removeEventListener("pointerdown", handlePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
    };
  }, [background, cascade, characterSet, colors, density, fontSize, glow, interactive, paused, resolution, speed, trailLength]);

  return <canvas ref={canvasRef} className={`terminal-rain ${className}`} aria-label="Animated terminal rain background" />;
}

export default TerminalRain;
