import { Link } from 'react-router-dom';
// assets 
import "./home.css";
import Me from "../../assets/home/me.webp";
import GradientASCII from "../../Components/reactbits/GradientASCII";
import VoxelArc from "../../Components/reactbits/VoxelArc";
import AstralShell from "../../Components/reactbits/AstralShell";
import TerminalRain from "../../Components/reactbits/TerminalRain";
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
              {heroBackground === "voxel-arc" && (
                <VoxelArc
                  interactive={settings?.voxelArcInteractive}
                  paused={settings?.voxelArcPaused}
                  waveStrength={settings?.voxelArcWaveStrength}
                  cellSize={settings?.voxelArcCellSize}
                  hue={settings?.voxelArcHue}
                />
              )}
              {heroBackground === "astral-shell" && (
                <AstralShell
                  interactive={settings?.astralShellInteractive}
                  draggable={settings?.astralShellDraggable}
                  clickPulse={settings?.astralShellClickPulse}
                  paused={settings?.astralShellPaused}
                  backgroundColor={settings?.astralShellBackground}
                  networkColor={settings?.astralShellNetworkColor}
                  highlightColor={settings?.astralShellHighlightColor}
                  pointCount={settings?.astralShellPointCount}
                  connections={settings?.astralShellConnections}
                  reach={settings?.astralShellReach}
                  clustering={settings?.astralShellClustering}
                  chords={settings?.astralShellChords}
                  radius={settings?.astralShellRadius}
                  originX={settings?.astralShellOriginX}
                  originY={settings?.astralShellOriginY}
                  rotationSpeed={settings?.astralShellRotationSpeed}
                  globeScale={settings?.astralShellScale}
                  nodeSize={settings?.astralShellNodeSize}
                  depthFade={settings?.astralShellDepthFade}
                  lineOpacity={settings?.astralShellLineOpacity}
                  spin={settings?.astralShellSpin}
                  tilt={settings?.astralShellTilt}
                  hoverRadius={settings?.astralShellHoverRadius}
                  hoverBoost={settings?.astralShellHoverBoost}
                  pulseSpeed={settings?.astralShellPulseSpeed}
                  seed={settings?.astralShellSeed}
                />
              )}
              {heroBackground === "terminal-rain" && (
                <TerminalRain
                  characters={settings?.terminalRainCharacters}
                  preset={settings?.terminalRainPreset}
                  mode={settings?.terminalRainMode}
                  trailColor={settings?.terminalRainTrailColor}
                  headColor={settings?.terminalRainHeadColor}
                  backgroundColor={settings?.terminalRainBackground}
                  fontSize={settings?.terminalRainFontSize}
                  spacing={settings?.terminalRainSpacing}
                  trailLength={settings?.terminalRainTrailLength}
                  speed={settings?.terminalRainSpeed}
                  density={settings?.terminalRainDensity}
                  variance={settings?.terminalRainVariance}
                  angle={settings?.terminalRainAngle}
                  shuffle={settings?.terminalRainShuffle}
                  depth={settings?.terminalRainDepth}
                  glow={settings?.terminalRainGlow}
                  intensity={settings?.terminalRainIntensity}
                  slowRadius={settings?.terminalRainSlowRadius}
                  slowStrength={settings?.terminalRainSlowStrength}
                  burstSize={settings?.terminalRainBurstSize}
                  mirror={settings?.terminalRainMirror}
                  bulletTime={settings?.terminalRainBulletTime}
                  clickBurst={settings?.terminalRainClickBurst}
                  interactive={settings?.terminalRainInteractive}
                  cascade={settings?.terminalRainCascade}
                  resolution={settings?.terminalRainResolution}
                />
              )}
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