import { Link } from 'react-router-dom';
// assets 
import "./home.css";
import Me from "../../assets/home/me.webp";
import TiltedCard from "../../Components/reactbits/TiltedCard";

function Home() {
  return (
    <>
            <div id="home" className=''>
              <div className='row homerow container-fluid reveal-on-scroll'>
                <div className='col-sm-8 col-md-6 left'>
                  <h1 className='container titlehome'>
                    Hello, I am <br />
                    Alan V.John
                  </h1>
                  <p className='container parahome'> 
                    A passionate software engineer based in Kerala. <br />
                    I create bespoke software solutions to elevate your online presence
                    and drive success! <br />
                    Eager to join a dynamic team and grow while contributing to
                  </p>
                  <div className="home-actions container">
                    <Link to="/projects" className="home-action">View Projects</Link>
                    <Link to="/contact" className="home-action home-action-secondary">Contact Me</Link>
                  </div>
                </div>
                <div className='col-12 col-md-6 right' >
                  <div className="hero-tilt">
                    <TiltedCard
                      imageSrc={Me}
                      altText="Profile picture of Alan V John"
                      containerHeight="100%"
                      containerWidth="100%"
                      imageHeight="100%"
                      imageWidth="100%"
                      scaleOnHover={1.03}
                      rotateAmplitude={8}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                  <div className="circle"></div>
                </div>
              </div>
            </div>
    </>
  )
}

export default Home