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
    mouseInteraction: settings?.asciiMouseInteraction ?? true,
    intro: settings?.asciiIntro ?? false,
    lightMode: settings?.asciiLightMode ?? false,
  };
  const density = 1;
  const opacity = 1;
  const glowStrength = 1;
  const speed = 1;
  const grain = 0.08;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const isMobile = mobileViewport.matches;
    const cellWidth = isMobile ? 24 : 15;
    const cellHeight = isMobile ? 28 : 18;
    let animationFrame;
    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let pointer = { x: 0.72, y: 0.45, active: false };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      columns = Math.ceil(width / cellWidth);
      rows = Math.ceil(height / cellHeight);
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const preset = presets[ascii.preset] || presets.atmosphere;
      const characters = characterSets[ascii.characters] || characterSets.classic;
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
          const glow = Math.max(0, 1 - distance * preset.multiplier) * glowStrength;
          const wave = reducedMotion.matches
            ? 0
            : Math.sin(time / 1800 + column * 0.16) * grain * (isMobile ? 0.45 : 1);
          const intensity = Math.max(
            0,
            Math.min(1, (glow + wave) * density + (ascii.intro ? 0.1 : 0))
          );
          const characterIndex = Math.min(
            characters.length - 1,
            Math.floor(intensity * characters.length)
          );

          if (characterIndex === 0) continue;

          const color = intensity > 0.55 ? preset.colors[1] : preset.colors[0];
          const alpha = Math.min(1, opacity * (0.12 + intensity * 0.48));
          context.fillStyle = ascii.lightMode
            ? `rgba(25, 35, 60, ${alpha})`
            : `rgba(${color}, ${alpha})`;
          context.fillText(characters[characterIndex], x, y);
        }
      }

      if (!reducedMotion.matches && !isMobile) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const animateMobile = (time) => {
      draw(time);
      if (isMobile && !reducedMotion.matches) {
        animationFrame = requestAnimationFrame(animateMobile);
      }
    };

    const updatePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      if (ascii.mouseInteraction && bounds.width && bounds.height) {
        pointer = {
          x: (event.clientX - bounds.left) / bounds.width,
          y: (event.clientY - bounds.top) / bounds.height,
          active: true,
        };
      }
    };

    const resetPointer = () => {
      pointer = { x: 0.72, y: 0.45, active: false };
    };

    resize();
    if (isMobile && !reducedMotion.matches) {
      animationFrame = requestAnimationFrame(animateMobile);
    } else {
      draw();
    }
    window.addEventListener("resize", resize);
    if (ascii.mouseInteraction) {
      window.addEventListener("pointermove", updatePointer, { passive: true });
      window.addEventListener("pointerdown", updatePointer, { passive: true });
      window.addEventListener("pointerup", resetPointer);
      window.addEventListener("pointercancel", resetPointer);
      window.addEventListener("blur", resetPointer);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", updatePointer);
      window.removeEventListener("pointerup", resetPointer);
      window.removeEventListener("pointercancel", resetPointer);
      window.removeEventListener("blur", resetPointer);
    };
  }, [
    ascii.intro,
    ascii.lightMode,
    ascii.mouseInteraction,
    ascii.preset,
    ascii.characters,
  ]);

  return <canvas ref={canvasRef} className="gradient-ascii" aria-hidden="true" />;
}

export default GradientASCII;
