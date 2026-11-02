import { useEffect, useRef } from "react";
import "./about.css";

const skills = [
  "JavaScript",
  "Dart",
  "TypeScript",
  "Python",
  "React",
  "Flutter",
  "Node.js",
  "Firebase",
  "MongoDB",
  "PostgreSQL",
];

function About() {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reducedMotion || !canTilt) return undefined;

    const handlePointerMove = (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 10;
      card.style.setProperty("--card-rotate-x", `${rotateX}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
      card.style.setProperty("--card-glow-x", `${x * 100}%`);
      card.style.setProperty("--card-glow-y", `${y * 100}%`);
      card.classList.add("is-tilting");
    };

    const resetCard = () => {
      card.style.setProperty("--card-rotate-x", "0deg");
      card.style.setProperty("--card-rotate-y", "0deg");
      card.style.setProperty("--card-glow-x", "50%");
      card.style.setProperty("--card-glow-y", "50%");
      card.classList.remove("is-tilting");
    };

    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", resetCard);
    return () => {
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", resetCard);
    };
  }, []);

  return (
    <div id="about" className="w-100">
      <div className="aboutmain reveal-on-scroll" data-scroll-section>
        <div className="about-layout">
          <div className="about-intro">
            <p className="about-eyebrow">01 / About</p>
            <h1 className="heading-about">Building useful digital experiences.</h1>
            <p className="abouttext">
              I&apos;m Alan V John, a student at the University of Worcester in
              the UK, originally from Kerala. I enjoy learning technology and
              turning what I learn into thoughtful, useful applications.
            </p>
            <p className="abouttext">
              My GitHub work reflects a practical approach: explore a
              technology, build something real, and keep improving it.
            </p>
          </div>
          <aside ref={cardRef} className="about-card" aria-label="Technology skills card">
            <div className="about-card-glow" aria-hidden="true" />
            <div className="about-card-content">
            <p className="about-eyebrow">Currently building with</p>
            <div className="about-skill-grid">
              {skills.map((skill) => (
                <span key={skill} className="about-skill">
                  {skill}
                </span>
              ))}
            </div>
            <a
              className="about-github-link"
              href="https://github.com/alanvjohn"
              target="_blank"
              rel="noopener noreferrer"
            >
              View GitHub profile <span aria-hidden="true">↗</span>
            </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default About;
