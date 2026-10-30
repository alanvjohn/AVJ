import './project.css';
import projectData from './data/projectdata';

const Projects = () => {
  return (
    <div className="project-page">
      <div className="project-container reveal-on-scroll">
        <section className="project-section">
          <h1 className="project-title">
            Projects
          </h1>
          <div className="project-list">
            {projectData.map((project) => (
              <a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-folder reveal-on-scroll"
                aria-label={`Open ${project.title} project`}
              >
                <div className="folder-tab" aria-hidden="true" />
                <div className="folder-preview">
                  {project.imgSrc && (
                    <img src={project.imgSrc} alt="" loading="lazy" />
                  )}
                </div>
                <div className="folder-content">
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <span className="project-link">Open project</span>
                </div>
                <div className="folder-corner" aria-hidden="true">
                  ↗
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
