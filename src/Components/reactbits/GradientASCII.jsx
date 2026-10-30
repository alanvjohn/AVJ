import { useEffect, useRef } from "react";
import { useFeatureSettings } from "../../config/FeatureSettingsContext";
import "./GradientASCII.css";

const characterSets = {
  classic: " .·:+*#@",
  letters: " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  symbols: " .·:+*#@░▒▓█",
};

const presets = {
  atmosphere: {
    colors: ["139, 185, 255", "93, 225, 208"],
    multiplier: 2.2,
  },
  lagoon: {
    colors: ["45, 212, 191", "167, 243, 208"],
    multiplier: 2.5,
  },
  violet: {
    colors: ["167, 139, 250", "244, 114, 182"],
    multiplier: 2,
  },
  rose: {
    colors: ["251, 113, 133", "244, 114, 182"],
    multiplier: 2.2,
  },
  corona: {
    colors: ["251, 191, 36", "251, 146, 60"],
    multiplier: 2.4,
  },
};

function GradientASCII() {
  const canvasRef = useRef(null);
  const settings = useFeatureSettings();
  const ascii = {
    preset: settings?.asciiPreset ?? "atmosphere",
    characters: settings?.asciiCharacters ?? "classic",
    cellSize: Number(settings?.asciiCellSize ?? 15),
    density: Number(settings?.asciiDensity ?? 0.8),
    opacity: Number(settings?.asciiOpacity ?? 0.75),
    glow: Number(settings?.asciiGlow ?? 0.2),
    speed: Number(settings?.asciiSpeed ?? 1),
    grain: Number(settings?.asciiGrain ?? 0.08),
    mouseInteraction: settings?.asciiMouseInteraction ?? true,
    intro: settings?.asciiIntro ?? true,
    lightMode: settings?.asciiLightMode ?? false,
  };

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
      columns = Math.ceil(width / ascii.cellSize);
      rows = Math.ceil(height / (ascii.cellSize * 1.2));
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const preset = presets[ascii.preset] || presets.atmosphere;
      const characters = characterSets[ascii.characters] || characterSets.classic;
      context.font = `${Math.max(10, ascii.cellSize * 0.72)}px monospace`;
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
          const glow = Math.max(0, 1 - distance * preset.multiplier) * ascii.glow;
          const wave = reducedMotion.matches
            ? 0
            : Math.sin(time / (1600 / Math.max(ascii.speed, 0.1)) + column * 0.22) * ascii.grain;
          const noise = Math.random() * ascii.grain;
          const intensity = Math.max(
            0,
            Math.min(1, (glow + wave + noise) * ascii.density + (ascii.intro ? 0.1 : 0))
          );
          const characterIndex = Math.min(
            characters.length - 1,
            Math.floor(intensity * characters.length)
          );

          if (characterIndex === 0) continue;

          const color = intensity > 0.55 ? preset.colors[1] : preset.colors[0];
          const alpha = Math.min(1, ascii.opacity * (0.25 + intensity * 0.75));
          context.fillStyle = ascii.lightMode
            ? `rgba(25, 35, 60, ${alpha})`
            : `rgba(${color}, ${alpha})`;
          context.fillText(characters[characterIndex], x, y);
        }
      }

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event) => {
      const bounds = canvas.getBoundingClientRect();
      if (ascii.mouseInteraction) {
        pointer = {
          x: (event.clientX - bounds.left) / bounds.width,
          y: (event.clientY - bounds.top) / bounds.height,
          active: true,
        };
      }
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
  }, [
    ascii.cellSize,
    ascii.density,
    ascii.glow,
    ascii.grain,
    ascii.intro,
    ascii.lightMode,
    ascii.mouseInteraction,
    ascii.opacity,
    ascii.preset,
    ascii.speed,
    ascii.characters,
  ]);

  return <canvas ref={canvasRef} className="gradient-ascii" aria-hidden="true" />;
}

export default GradientASCII;
