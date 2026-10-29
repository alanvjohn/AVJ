import "./about.css";

function About() {
  return (
    <>
      <div id="about" className="w-100">
        <div className="aboutmain" data-scroll-section>
          <div className="subabout" >
            <h1 className="heading-about" data-scroll  >About Me</h1>
            <p className="container lh-base abouttext" data-scroll >
              Hi, I&apos;m Alan V John, a dedicated and hardworking B.Tech graduate
              in Computer Science & Engineering, class of 2023.Born on December
              6, 2000, I am passionate about technology and committed to
              delivering high-quality work in every project I undertake. My
              professional journey began with a 6-month internship at Luminar
              Technolab in Kochi, where I honed my skills as a React JS
              developer and earned a <span className="fw-bold">NACTECT certification</span>. Currently, I am
              expanding my expertise as a <span className="fw-bold">Flutter developer</span> during my internship
              with Zidio development. Beyond my technical skills, which you can
              explore in the dedicated skills section, I am a grounded and
              hands-on individual who enjoys listening to music, solving
              practical challenges, and supporting my parents in my free time. I
              believe in lifelong learning and consistently bring a positive and
              solution-oriented mindset to all my pursuits. Let&apos;s connect and
              explore how we can collaborate on exciting projects!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
