import { useMemo } from "react";
import { getFeatureSettings } from "../../config/featureSettings";
import "./loader.css";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function LetterGlitchLoader() {
  const cells = useMemo(
    () => Array.from({ length: 900 }, (_, index) => ({
      id: index,
      letter: letters[Math.floor(Math.random() * letters.length)],
      delay: `${Math.random() * 1.8}s`,
    })),
    []
  );

  return (
    <div className="loader-effect letter-glitch-loader" aria-hidden="true">
      {cells.map((cell) => (
        <span key={cell.id} style={{ animationDelay: cell.delay }}>
          {cell.letter}
        </span>
      ))}
    </div>
  );
}

function ShapeGridLoader() {
  return (
    <div className="loader-effect shape-grid-loader" aria-hidden="true">
      {Array.from({ length: 25 }, (_, index) => <span key={index} />)}
    </div>
  );
}

function DotGridLoader() {
  return (
    <div className="loader-effect dot-grid-loader" aria-hidden="true">
      {Array.from({ length: 49 }, (_, index) => <span key={index} />)}
    </div>
  );
}

const Loader = () => {
  const { loaderStyle } = getFeatureSettings();
  const selectedStyle = loaderStyle === "random"
    ? (Math.random() > 0.5 ? "shape-grid" : "dot-grid")
    : loaderStyle;

  let effect = <div className="custom-loader" />;
  if (selectedStyle === "letter-glitch") effect = <LetterGlitchLoader />;
  if (selectedStyle === "shape-grid") effect = <ShapeGridLoader />;
  if (selectedStyle === "dot-grid") effect = <DotGridLoader />;

  return (
    <div className="loader">
      {effect}
    </div>
  );
};

export default Loader;
