import { Link } from 'react-router-dom';
// assets 
import "./home.css";
import Me from "../../assets/home/me.webp";
import GradientASCII from "../../Components/reactbits/GradientASCII";

function Home() {
  return (
    <>
            <div id="home" className='home-page'>
              <div className="security-grid" aria-hidden="true" />
              <GradientASCII />
              <div className='row homerow container-fluid reveal-on-scroll'>
                <div className='col-sm-8 col-md-6 left'>
                  <p className="home-eyebrow">Software engineering · Cybersecurity</p>
                  <h1 className='container titlehome'>
                    Building secure <br />
                    digital experiences.
                  </h1>
                  <p className='container parahome'> 
                    I&apos;m Alan V. John, a software engineer and MSc Cybersecurity
                    student based in Kerala. I build useful applications while
                    developing a deeper practice in secure software and application
                    security.
                  </p>
                  <div className="home-actions container">
                    <Link to="/projects" className="home-action">View Projects</Link>
                    <Link to="/contact" className="home-action home-action-secondary">Contact Me</Link>
                  </div>
                </div>
                <div className='col-12 col-md-6 right' >
                  <img src={Me} alt='Profile picture of Alan V John' className='me img-fluid w-75' fetchPriority='high' width="1200" height="1200"/>
                  <div className="circle"></div>
                </div>
              </div>
            </div>
    </>
  )
}

export default Home