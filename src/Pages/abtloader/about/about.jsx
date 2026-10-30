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
  return (
    <div id="about" className="w-100">
      <div className="aboutmain reveal-on-scroll" data-scroll-section>
        <div className="about-layout">
          <div className="about-intro">
            <p className="about-eyebrow">01 / About</p>
            <h1 className="heading-about">Building useful digital experiences.</h1>
            <p className="abouttext">
              I&apos;m Alan V John, a software engineer from Kerala focused on
              thoughtful interfaces, reliable applications, and continuous
              learning. I work across web and mobile projects, from React
              applications to Flutter products and Firebase-backed services.
            </p>
            <p className="abouttext">
              My GitHub work reflects a practical, product-minded approach:
              learn a technology, build something real, and keep improving it.
            </p>
          </div>
          <aside className="about-card">
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
          </aside>
        </div>
      </div>
    </div>
  );
}

export default About;
