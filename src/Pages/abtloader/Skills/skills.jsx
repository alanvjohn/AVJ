import "./skills.css";
const Skills = () => {
  const skills = ["JavaScript", "Dart", "TypeScript", "Python", "React", "Flutter", "Node.js", "Express", "Firebase", "MongoDB", "PostgreSQL", "HTML", "CSS", "Tailwind CSS", "Docker"];
  return (
    <section className="skill-holder reveal-on-scroll">
      <div className="skills-heading">
        <p className="skills-eyebrow">02 / Toolkit</p>
        <h1 className="header-skills">Tools I use to turn ideas into products.</h1>
      </div>
      <div className="skillslist">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  )
}

export default Skills