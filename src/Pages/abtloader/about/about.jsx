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
            <h1 className="heading-about">Building useful, secure digital experiences.</h1>
            <p className="abouttext">
              I&apos;m Alan V John, a software engineer and MSc Cybersecurity
              student from Kerala. I focus on thoughtful interfaces, reliable
              applications, and the security decisions that help products earn
              user trust.
            </p>
            <p className="abouttext">
              My work combines product development with continuous security
              learning: understand the risk, build in a controlled environment,
              and improve the result through testing and iteration.
            </p>
          </div>
          <div className="security-focus" id="security-focus">
            <p className="about-eyebrow">Security focus</p>
            <div className="security-focus-grid">
              <span>Secure software development</span>
              <span>Web application security</span>
              <span>Network security</span>
              <span>Security testing</span>
              <span>Cloud security fundamentals</span>
              <span>Digital forensics foundations</span>
            </div>
          </div>
          <aside className="about-card">
            <p className="about-eyebrow">Development toolkit</p>
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
