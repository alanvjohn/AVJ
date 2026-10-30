import { useMemo, useState } from 'react';
import './project.css';
import projectData from './data/projectdata';
import TiltedCard from '../../Components/reactbits/TiltedCard';

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', ...new Set(projectData.flatMap((project) => project.tags))];
  const visibleProjects = useMemo(
    () => activeFilter === 'All'
      ? projectData
      : projectData.filter((project) => project.tags.includes(activeFilter)),
    [activeFilter]
  );

  return (
    <div className="project-page">
      <div className="project-container reveal-on-scroll">
        <section className="project-section">
          <h1 className="project-title">
            Projects
          </h1>
          <div className="project-filters" aria-label="Filter projects by technology">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`project-filter${activeFilter === filter ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="project-list">
            {visibleProjects.map((project) => (
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
                  <TiltedCard
                    imageSrc={project.imgSrc}
                    altText={`${project.title} preview`}
                    containerHeight="100%"
                    containerWidth="100%"
                    imageHeight="100%"
                    imageWidth="100%"
                    scaleOnHover={1.04}
                    rotateAmplitude={6}
                    showMobileWarning={false}
                    showTooltip={false}
                  />
                </div>
                <div className="folder-content">
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
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
