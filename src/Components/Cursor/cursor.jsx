import { useEffect, useRef, useState } from "react";
import "./cursor.css";
import { getFeatureSettings } from "../../config/featureSettings";

function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const frameRef = useRef(null);
  const positionRef = useRef({ x: -100, y: -100 });
  const ringPositionRef = useRef({ x: -100, y: -100 });
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!finePointer.matches || reducedMotion.matches) {
      return undefined;
    }
    if (!getFeatureSettings().cursor) {
      return undefined;
    }

    const updateCursor = (event) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
      setIsInteractive(Boolean(event.target.closest("a, button, .project-folder")));
    };

    const animate = () => {
      const { x, y } = positionRef.current;
      const ring = ringPositionRef.current;
      ring.x += (x - ring.x) * 0.16;
      ring.y += (y - ring.y) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("pointermove", updateCursor);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("pointermove", updateCursor);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <>
      <span ref={cursorRef} className="custom-cursor" aria-hidden="true" />
      <span
        ref={ringRef}
        className={`custom-cursor-ring${isInteractive ? " is-interactive" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}

export default Cursor;
