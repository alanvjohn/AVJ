import { Link } from 'react-router-dom';
// assets 
import "./home.css";
import Me from "../../assets/home/me.webp";
import GradientASCII from "../../Components/reactbits/GradientASCII";
import VoxelArc from "../../Components/reactbits/VoxelArc";
import AstralShell from "../../Components/reactbits/AstralShell";
import { useFeatureSettings } from "../../config/FeatureSettingsContext";

function Home() {
  const settings = useFeatureSettings();
  const heroBackground = settings?.heroBackground ?? "ascii";
  const showProfileImage = (typeof window === "undefined" || window.innerWidth > 767)
    && settings?.showHeroProfile !== false;
  const heroTitle = settings?.heroTitle || "Learning, building, and exploring technology.";
  const heroSubtitle = settings?.heroSubtitle || "I'm Alan V. John, a student at the University of Worcester in the UK, originally from Kerala. I enjoy learning technology, building useful applications, and improving my skills through practical projects.";

  return (
    <>
            <div id="home" className={`home-page hero-background-${heroBackground}`}>
              {heroBackground !== "plain" && <div className="security-grid" aria-hidden="true" />}
              {heroBackground === "ascii" && <GradientASCII />}
              {heroBackground === "voxel-arc" && <VoxelArc />}
              {heroBackground === "astral-shell" && <AstralShell />}
              <div className='row homerow container-fluid reveal-on-scroll'>
                <div className='col-sm-8 col-md-6 left'>
                  <p className="home-eyebrow">{settings?.heroEyebrow || "Technology · Learning · Building"}</p>
                  <h1 className='container titlehome'>
                    {heroTitle}
                  </h1>
                  <p className='container parahome'> 
                    {heroSubtitle}
                  </p>
                  {settings?.showHeroActions !== false && <div className="home-actions container">
                    <Link to="/projects" className="home-action">View Projects</Link>
                    <Link to="/contact" className="home-action home-action-secondary">Contact Me</Link>
                  </div>}
                </div>
                <div className='col-12 col-md-6 right' >
                  {showProfileImage && (
                    <img
                      src={Me}
                      alt='Profile picture of Alan V John'
                      className='me img-fluid w-75'
                      fetchPriority='high'
                      width="1200"
                      height="1200"
                      loading="eager"
                    />
                  )}
                  <div className="circle"></div>
                </div>
              </div>
            </div>
    </>
  )
}

export default Home