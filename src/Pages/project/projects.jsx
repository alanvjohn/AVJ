import './project.css';
import projectData from './data/projectdata';

const Projects = () => {
  return (
    <div className="project-page">
      <div className="project-container">
        <section className="project-section" data-scroll-section>
          <h1 className="project-title" data-scroll data-scroll-speed="2">
            Projects
          </h1>
          <div className="project-list">
            {projectData.map((project) => (
              <article
                key={project.id}
                className="project-folder"
                data-scroll
                data-scroll-speed="1"
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
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      Open project
                    </a>
                  )}
                </div>
                <div className="folder-corner" aria-hidden="true">
                  ↗
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
