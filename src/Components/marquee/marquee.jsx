import "./marquee.css"
import {
    FaJs,
    FaReact,
    FaVuejs,
    FaPython,
    FaFigma,
    FaNode,
  } from "react-icons/fa";
  import {
    SiFlutter,
    SiDart,
    SiMongodb,
    SiHive,
    SiAdobephotoshop,
    SiCanva,
  } from "react-icons/si";
  import {
    SiNextdotjs,
    SiExpress,
    SiTailwindcss,
    SiFirebase,
    SiPostgresql,
    SiDocker,
    SiKubernetes,
    SiRedux,
    SiTypescript,
  } from "react-icons/si";
  import { TiHtml5 } from "react-icons/ti";

const icons = [
  TiHtml5,
  FaJs,
  FaReact,
  FaVuejs,
  SiFlutter,
  SiDart,
  SiMongodb,
  SiHive,
  FaPython,
  FaFigma,
  SiCanva,
  SiAdobephotoshop,
  SiNextdotjs,
  FaNode,
  SiExpress,
  SiTailwindcss,
  SiFirebase,
  SiPostgresql,
  SiDocker,
  SiKubernetes,
  SiRedux,
  SiTypescript,
];

const Marquee = () => {
    const renderIcons = (hidden = false) => (
      <div className="marquee__group" aria-hidden={hidden}>
        {icons.map((Icon, index) => (
          <div className="marquee__part" key={`${hidden ? "duplicate-" : ""}${index}`}>
            <Icon className="skill-icon" />
          </div>
        ))}
      </div>
    );

  return (
    <section className="marquee" aria-label="Technology skills">
      <div className="marquee__inner">
        {renderIcons()}
        {renderIcons(true)}
      </div>
    </section>
  )
}

export default Marquee