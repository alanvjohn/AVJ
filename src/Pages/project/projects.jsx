import { useMemo, useState } from 'react';
import './project.css';
import projectData from './data/projectdata';
import TiltedCard from '../../Components/reactbits/TiltedCard';
import { getFeatureSettings } from '../../config/featureSettings';

const Projects = () => {
  const [featureSettings] = useState(getFeatureSettings);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAllProjects, setShowAllProjects] = useState(false);
  const filters = ['All', ...new Set(projectData.flatMap((project) => project.tags))];
  const visibleProjects = useMemo(
    () => activeFilter === 'All'
      ? projectData
      : projectData.filter((project) => project.tags.includes(activeFilter)),
    [activeFilter]
  );
  const projectsToRender = showAllProjects
    ? visibleProjects
    : visibleProjects.slice(0, 6);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setShowAllProjects(false);
  };

  return (
    <div className="project-page">
      <div className="project-container reveal-on-scroll">
        <section className="project-section">
          <h1 className="project-title">
            Selected work
          </h1>
          <p className="project-intro">
            Product builds, experiments, and security-focused learning. Each
            project is developed responsibly and documented around what I
            learned.
          </p>
          <div className="project-filters" aria-label="Filter projects by technology">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`project-filter${activeFilter === filter ? ' is-active' : ''}`}
                onClick={() => handleFilterChange(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="project-list">
            {projectsToRender.map((project) => (
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
                    enabled={featureSettings.reactBitsCards}
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
          {visibleProjects.length > 6 && (
            <button
              type="button"
              className="project-more-button"
              onClick={() => setShowAllProjects((isExpanded) => !isExpanded)}
              aria-expanded={showAllProjects}
            >
              {showAllProjects ? 'Show fewer projects' : `Show all ${visibleProjects.length} projects`}
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Projects;
