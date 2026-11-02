import "./skills.css";
import { useFeatureSettings } from "../../../config/FeatureSettingsContext";

const Skills = () => {
  const settings = useFeatureSettings();
  const skills = ["JavaScript", "Dart", "TypeScript", "Python", "React", "Flutter", "Node.js", "Express", "Firebase", "MongoDB", "PostgreSQL", "HTML", "CSS", "Tailwind CSS", "Docker"];
  const toolkitStyle = settings?.toolkitStyle || "cyber-field";
  const chipMotion = settings?.toolkitChipMotion !== false;

  return (
    <section className={`skill-holder toolkit-style-${toolkitStyle}${chipMotion ? "" : " toolkit-no-chip-motion"} reveal-on-scroll`}>
      <div className="skills-heading">
        <p className="skills-eyebrow">02 / Toolkit</p>
        <h1 className="header-skills">Tools I use to build and secure products.</h1>
      </div>
      <div className="skillslist">
        {skills.map((skill, index) => (
          <span
            key={skill}
            className="skill-chip"
            style={{ "--skill-index": index }}
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}

export default Skills