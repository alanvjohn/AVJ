import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_EMAIL,
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  signOut,
} from "../contact/firebase";
import TiltedCard from "../../Components/reactbits/TiltedCard";
import GradientASCII from "../../Components/reactbits/GradientASCII";
import VoxelArc from "../../Components/reactbits/VoxelArc";
import AstralShell from "../../Components/reactbits/AstralShell";
import TerminalRain from "../../Components/reactbits/TerminalRain";
import {
  defaultFeatureSettings,
  applyFeatureSettingsLocally,
  getFeatureSettings,
  requestVisitorRefresh,
  saveFeatureSettings,
} from "../../config/featureSettings";
import FeatureSettingsContext from "../../config/FeatureSettingsContext";
import "./vaultadmin.css";

const featureLabels = {
  lenis: ["Lenis smooth scroll", "Soft wheel scrolling for desktop visitors."],
  revealAnimations: ["Scroll reveals", "GSAP entrance motion for page sections."],
  cursor: ["Interactive cursor", "Desktop-only cursor ring and hover feedback."],
  reactBitsCards: ["React Bits card tilt", "Subtle 3D interaction on project previews."],
};

const lenisOptions = [
  ["lenisLerp", "Smoothness", "Lower values feel softer and slower; higher values feel more responsive.", 0.02, 0.2, 0.01, "lerp"],
  ["lenisWheelMultiplier", "Wheel speed", "Adjust how strongly desktop wheel movement affects scrolling.", 0.5, 2, 0.1, "multiplier"],
  ["lenisTouchMultiplier", "Touch speed", "Adjust how strongly touch movement affects scrolling.", 0.5, 2, 0.1, "multiplier"],
];
const motionPresetOptions = [
  ["calm", "Calm", "Soft reveals with relaxed movement and a quieter scroll feel."],
  ["snappy", "Snappy", "Short, responsive reveals for a faster interface."],
  ["cinematic", "Cinematic", "Longer, deeper entrances for a more dramatic portfolio feel."],
  ["cyber", "Cyber", "Crisp movement, slight lift, and energetic timing for the AVJ style."],
];
const toolkitStyleOptions = [
  ["cyber-field", "Cyber field", "Animated grid, signal scan, particles, and accent glow."],
  ["signal", "Signal scan", "Technical grid with a single moving scan line."],
  ["particles", "Soft particles", "Quiet grid with drifting React Bits-style particles."],
  ["minimal", "Minimal grid", "A restrained technical grid with no extra motion layers."],
  ["off", "Off", "A clean toolkit section with no decorative background animation."],
];

const heroBackgroundOptions = [
  ["ascii", "ASCII gradient", "Animated characters that respond to the pointer."],
  ["voxel-arc", "Voxel Arc", "A rolling pixel-wave horizon with pointer wake interaction."],
  ["terminal-rain", "Terminal Rain", "Layered glowing glyphs falling in columns with optional click cascades."],
  ["astral-shell", "Astral Shell", "A rotating connected-star globe with pointer highlights."],
  ["grid", "Grid only", "A quiet technical grid without the ASCII animation."],
  ["plain", "Plain", "No decorative hero background."],
];

const loaderOptions = [
  ["letter-glitch", "Letter Glitch", "Flickering letters inspired by the React Bits background."],
  ["random", "Random Shapes / Dots", "Chooses Shape Grid or Dot Grid each time a loader appears."],
  ["random-all", "Random Everything", "Chooses any available loader style each time a loader appears."],
  ["shape-grid", "Shape Grid", "Animated perspective shapes for a geometric loading state."],
  ["dot-grid", "Dot Grid", "A springy animated dot pattern for a lighter loading state."],
  ["classic", "Classic", "The original compact AVJ loading indicator."],
];

const asciiPresetOptions = [
  ["atmosphere", "Atmosphere"],
  ["lagoon", "Lagoon"],
  ["rose", "Rose"],
  ["corona", "Corona"],
  ["violet", "Violet"],
];

const asciiCharacterOptions = [
  ["classic", "Classic"],
  ["letters", "Letters"],
  ["symbols", "Symbols"],
  ["custom", "Custom"],
];
const asciiColorOptions = [
  ["atmosphere", "Atmosphere"],
  ["lagoon", "Lagoon"],
  ["violet", "Violet"],
  ["rose", "Rose"],
  ["corona", "Corona"],
  ["mono", "Monochrome"],
  ["cyber", "Cyber neon"],
  ["ember", "Ember"],
];
const astralShellPresets = {
  violet: { background: "#0a0a0a", networkColor: "#7c6bff", highlightColor: "#ffe6fa" },
  cyan: { background: "#061014", networkColor: "#40d9ff", highlightColor: "#e5fbff" },
  mono: { background: "#090909", networkColor: "#a7adb7", highlightColor: "#ffffff" },
  rose: { background: "#14070d", networkColor: "#ff5f9e", highlightColor: "#ffe6f1" },
  ink: { background: "#020307", networkColor: "#60708d", highlightColor: "#d8e6ff" },
  lilac: { background: "#100b18", networkColor: "#a875ff", highlightColor: "#f4eaff" },
};
const astralShellPresetOptions = Object.keys(astralShellPresets).map((value) => [
  value,
  value[0].toUpperCase() + value.slice(1),
]);
const terminalRainPresets = {
  aurora: { trailColor: "#9d7bff", headColor: "#ffd6f5", background: "#0a0a0a" },
  matrix: { trailColor: "#29d17d", headColor: "#e5fff0", background: "#020a05" },
  amber: { trailColor: "#d99b38", headColor: "#fff0bd", background: "#100b03" },
  binary: { trailColor: "#5da9ff", headColor: "#eef7ff", background: "#050b16" },
  storm: { trailColor: "#7d8ca8", headColor: "#e5ebf5", background: "#080b12" },
  drizzle: { trailColor: "#41b8c5", headColor: "#e8ffff", background: "#061012" },
  mono: { trailColor: "#8f969f", headColor: "#ffffff", background: "#090909" },
};
const terminalRainPresetOptions = Object.keys(terminalRainPresets).map((value) => [
  value,
  value[0].toUpperCase() + value.slice(1),
]);
const terminalRainModes = [["auto", "Auto"], ["glow", "Glow"], ["ink", "Ink"]];
const terminalRainGlyphs = [
  ["katakana", "Katakana", "アイウエオカキクケコサシスセソ"],
  ["binary", "Binary", "01"],
  ["hex", "Hex", "0123456789ABCDEF"],
  ["latin", "Latin", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
  ["symbols", "Symbols", "!@#$%^&*+-=[]{}<>?/|"],
];
const voxelArcPresets = {
  horizon: { color: "#5227ff", accent: "#b19eef", background: "#0a0a0a" },
  dusk: { color: "#c05cff", accent: "#ffd0f2", background: "#100817" },
  calm: { color: "#2c9cff", accent: "#b9e8ff", background: "#06101c" },
  storm: { color: "#4772a8", accent: "#d5e5ff", background: "#080d16" },
  dots: { color: "#36d399", accent: "#d4ffe9", background: "#04100b" },
  grid: { color: "#8b98ad", accent: "#edf2f7", background: "#0b0d10" },
  planet: { color: "#ff914d", accent: "#ffe2c9", background: "#130b05" },
};
const voxelArcPresetOptions = Object.keys(voxelArcPresets).map((value) => [
  value,
  value[0].toUpperCase() + value.slice(1),
]);
const accentOptions = [
  ["blue", "AVJ blue"],
  ["cyan", "Cyber cyan"],
  ["violet", "Violet"],
  ["rose", "Rose"],
  ["amber", "Amber"],
  ["green", "Terminal green"],
];

function VaultAdmin() {
  const [user, setUser] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [settings, setSettings] = useState(getFeatureSettings);
  const [savedMessage, setSavedMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [diagnostics, setDiagnostics] = useState({
    score: "--",
    loadTime: "--",
    connection: "Checking...",
    firebase: "Checking...",
    firebaseLatency: "--",
    fcp: "--",
    lcp: "--",
    cls: "--",
    inp: "--",
    updatedAt: "Not available",
    settings: "Checking...",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser?.email?.toLowerCase() === ADMIN_EMAIL) {
        setUser(currentUser);
      } else {
        if (currentUser) signOut(auth);
        setUser(null);
      }
      setIsCheckingAccess(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let isMounted = true;

    const measureDiagnostics = async () => {
      const navigationEntry = performance.getEntriesByType("navigation")[0];
      const loadTime = navigationEntry?.loadEventEnd
        ? navigationEntry.loadEventEnd
        : performance.now();
      const score = Math.max(0, Math.min(100, Math.round(100 - loadTime / 80)));
      const connection = navigator.connection;
      const connectionLabel = connection
        ? `${connection.effectiveType || "unknown"}${connection.downlink ? ` · ${connection.downlink} Mbps` : ""}`
        : "Browser API unavailable";

      let firebaseStatus = "Connected";
      let firebaseLatency = "--";
      let updatedAt = "Not available";
      let settingsSummary = "Unavailable";
      const firebaseStart = performance.now();
      try {
        const snapshot = await getDoc(doc(db, "siteSettings", "appearance"));
        firebaseLatency = `${Math.round(performance.now() - firebaseStart)} ms`;
        if (snapshot.exists()) {
          const data = snapshot.data();
          settingsSummary = `${data.heroBackground || "default"} · ${data.loaderStyle || "default"}`;
          updatedAt = data.updatedAt?.toDate
            ? data.updatedAt.toDate().toLocaleString()
            : "Not recorded";
        } else {
          settingsSummary = "Defaults";
        }
      } catch (error) {
        console.error("Firebase diagnostics failed:", error);
        firebaseStatus = "Unavailable";
      }
      if (isMounted) {
        setDiagnostics({
          score,
          loadTime: `${Math.round(loadTime)} ms`,
          connection: connectionLabel,
          firebase: firebaseStatus,
          firebaseLatency,
          updatedAt,
          settings: settingsSummary,
        });
      }
    };

    measureDiagnostics();
    const observers = [];
    const observe = (type, callback) => {
      if (!("PerformanceObserver" in window) || !PerformanceObserver.supportedEntryTypes?.includes(type)) {
        return;
      }
      const observer = new PerformanceObserver(callback);
      observer.observe({ type, buffered: true });
      observers.push(observer);
    };

    observe("paint", (list) => {
      const firstPaint = list.getEntriesByName("first-contentful-paint")[0];
      if (firstPaint && isMounted) {
        setDiagnostics((current) => ({ ...current, fcp: `${Math.round(firstPaint.startTime)} ms` }));
      }
    });
    observe("largest-contentful-paint", (list) => {
      const entries = list.getEntries();
      const largest = entries[entries.length - 1];
      if (largest && isMounted) {
        setDiagnostics((current) => ({ ...current, lcp: `${Math.round(largest.startTime)} ms` }));
      }
    });
    observe("layout-shift", (list) => {
      const cls = list.getEntries().reduce(
        (total, entry) => (entry.hadRecentInput ? total : total + entry.value),
        0
      );
      if (isMounted) {
        setDiagnostics((current) => ({ ...current, cls: cls.toFixed(3) }));
      }
    });
    observe("event", (list) => {
      const maxDuration = Math.max(
        0,
        ...list.getEntries().map((entry) => entry.duration)
      );
      if (isMounted && maxDuration > 0) {
        setDiagnostics((current) => ({ ...current, inp: `${Math.round(maxDuration)} ms` }));
      }
    });

    return () => {
      isMounted = false;
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const saveSettings = async (nextSettings, message) => {
    setSaveError("");
    setSavedMessage("");
    setIsSaving(true);
    const optimisticSettings = applyFeatureSettingsLocally(nextSettings);
    setSettings(optimisticSettings);

    try {
      const savedSettings = await saveFeatureSettings(nextSettings);
      setSettings(savedSettings);
      setSavedMessage(message);
    } catch (error) {
      console.error("Unable to save site settings:", error);
      setSaveError(
        error?.code === "permission-denied"
          ? "Firebase rejected this save. Publish the latest firestore.rules from the repository, then sign in as alanjohn9626@gmail.com and try again."
          : `Unable to save site settings${error?.code ? ` (${error.code})` : ""}. Check the browser console and Firebase connection.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const updateFeature = async (feature) => {
    await saveSettings({
      ...settings,
      [feature]: !settings[feature],
    }, "Saved and applied to active visitors.");
  };

  const resetFeatures = async () => {
    await saveSettings(defaultFeatureSettings, "Settings reset and applied.");
  };

  const updateHeroBackground = async (event) => {
    await saveSettings({
      ...settings,
      heroBackground: event.target.value,
    }, "Hero background saved and applied.");
  };

  const updateLoaderStyle = async (event) => {
    await saveSettings({
      ...settings,
      loaderStyle: event.target.value,
    }, "Loader style saved and applied.");
  };

  const saveToolkitSettings = async () => {
    await saveSettings(settings, "Toolkit settings saved and applied.");
  };

  const updateAsciiSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveAsciiSettings = async () => {
    await saveSettings(settings, "Gradient ASCII settings saved and applied.");
  };

  const saveLenisSettings = async () => {
    await saveSettings(settings, "Lenis scrolling settings saved and applied.");
  };

  const refreshVisitors = async () => {
    setSaveError("");
    setSavedMessage("");
    try {
      await requestVisitorRefresh();
      setSavedMessage("Refresh signal sent to active visitors.");
    } catch (error) {
      console.error("Unable to refresh visitors:", error);
      setSaveError("Unable to send the refresh signal. Check Firebase rules and connection.");
    }
  };

  if (isCheckingAccess) {
    return <main className="vault-admin-page">Checking access...</main>;
  }

  if (!user) {
    return (
      <main className="vault-admin-page">
        <div className="vault-admin-locked">
          <p className="vault-admin-eyebrow">Private area</p>
          <h1>Vault controls are protected.</h1>
          <p>Sign in through the Vault before opening this page.</p>
          <Link to="/vault" className="vault-admin-link">Go to Vault</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="vault-admin-page">
      <div className="vault-admin-shell">
        <header className="vault-admin-header">
          <div>
            <p className="vault-admin-eyebrow">Private control room</p>
            <h1>Vault Admin</h1>
            <p>Manage presentation features for this browser without touching visitor data.</p>
          </div>
          <div className="vault-admin-actions">
            <Link to="/vault/admin/login-log" className="vault-admin-button">Login history</Link>
            <Link to="/vault" className="vault-admin-button">Back to Vault</Link>
            <button type="button" onClick={refreshVisitors}>Refresh all visitors</button>
            <button type="button" onClick={() => signOut(auth)}>Sign out</button>
          </div>
        </header>

        <section className="admin-diagnostics" aria-labelledby="diagnostics-title">
          <div className="admin-diagnostics-heading">
            <p className="vault-admin-eyebrow">Live diagnostics</p>
            <h2 id="diagnostics-title">Page health</h2>
            <p>Quick browser and Firebase checks for this admin session.</p>
          </div>
          <div className="diagnostic-metric">
            <span>Page score</span>
            <strong>{diagnostics.score}<small>/100</small></strong>
            <em>Estimated load score</em>
          </div>
          <div className="diagnostic-metric">
            <span>Loading speed</span>
            <strong>{diagnostics.loadTime}</strong>
            <em>Page load time</em>
          </div>
          <div className="diagnostic-metric">
            <span>Connection</span>
            <strong>{diagnostics.connection}</strong>
            <em>Browser network estimate</em>
          </div>
          <div className="diagnostic-metric">
            <span>Firebase</span>
            <strong className={diagnostics.firebase === "Connected" ? "is-success" : "is-error"}>
              {diagnostics.firebase}
            </strong>
            <em>Firestore read check</em>
          </div>
          <div className="diagnostic-metric">
            <span>Firestore latency</span>
            <strong>{diagnostics.firebaseLatency}</strong>
            <em>Settings read time</em>
          </div>
          <div className="diagnostic-metric">
            <span>First content</span>
            <strong>{diagnostics.fcp}</strong>
            <em>FCP</em>
          </div>
          <div className="diagnostic-metric">
            <span>Largest content</span>
            <strong>{diagnostics.lcp}</strong>
            <em>LCP</em>
          </div>
          <div className="diagnostic-metric">
            <span>Layout shift</span>
            <strong>{diagnostics.cls}</strong>
            <em>CLS</em>
          </div>
          <div className="diagnostic-metric">
            <span>Interaction delay</span>
            <strong>{diagnostics.inp}</strong>
            <em>INP estimate</em>
          </div>
        </section>

        <section className="admin-diagnostics-details" aria-label="Current site status">
          <div>
            <span>Active appearance settings</span>
            <strong>{diagnostics.settings}</strong>
          </div>
          <div>
            <span>Last settings update</span>
            <strong>{diagnostics.updatedAt}</strong>
          </div>
          <div>
            <span>Environment</span>
            <strong>{import.meta.env.MODE}</strong>
          </div>
        </section>

        <section className="vault-admin-grid" aria-label="Feature controls">
          {Object.entries(featureLabels).map(([feature, [title, description]]) => (
            <article className="feature-control" key={feature}>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <button
                type="button"
                className={`feature-switch${settings[feature] ? " is-on" : ""}`}
                aria-pressed={settings[feature]}
                onClick={() => updateFeature(feature)}
              >
                {settings[feature] ? "On" : "Off"}
              </button>
            </article>
          ))}
        </section>

        <section className="vault-admin-settings vault-admin-background-settings" aria-labelledby="hero-settings-title">
          <div>
            <p className="vault-admin-eyebrow">Site appearance</p>
            <h2 id="hero-settings-title">Hero background</h2>
            <p>Choose the decorative background shown behind the homepage introduction.</p>
          </div>
          <label className="admin-select-label" htmlFor="hero-background">
            Background style
            <select
              id="hero-background"
              value={settings.heroBackground}
              onChange={updateHeroBackground}
            >
              {heroBackgroundOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <p className="admin-setting-hint">
            {heroBackgroundOptions.find(([value]) => value === settings.heroBackground)?.[2]}
          </p>
          <div className="admin-background-preview" aria-label="Selected hero background preview">
            <div className="admin-background-preview-label">
              <span>Live preview</span>
              <strong>{heroBackgroundOptions.find(([value]) => value === settings.heroBackground)?.[1]}</strong>
            </div>
            <div className="admin-ascii-live-preview">
              <FeatureSettingsContext.Provider value={settings}>
                {settings.heroBackground === "voxel-arc"
                  ? <VoxelArc
                    interactive={settings.voxelArcInteractive}
                    preset={settings.voxelArcPreset}
                    color={settings.voxelArcColor}
                    accent={settings.voxelArcAccent}
                    backgroundColor={settings.voxelArcBackground}
                    density={settings.voxelArcDensity}
                    voxelSize={settings.voxelArcSize}
                    roundness={settings.voxelArcRoundness}
                    tilt={settings.voxelArcTilt}
                    horizon={settings.voxelArcHorizon}
                    curvature={settings.voxelArcCurvature}
                    waveHeight={settings.voxelArcWaveHeight}
                    waveLength={settings.voxelArcWaveLength}
                    speed={settings.voxelArcSpeed}
                    turbulence={settings.voxelArcTurbulence}
                    brightness={settings.voxelArcBrightness}
                    glowStrength={settings.voxelArcGlow}
                    haze={settings.voxelArcHaze}
                    bloom={settings.voxelArcBloom}
                    focus={settings.voxelArcFocus}
                    aperture={settings.voxelArcAperture}
                    grain={settings.voxelArcGrain}
                    ripples={settings.voxelArcRipples}
                    intro={settings.voxelArcIntro}
                    paused={settings.voxelArcPaused}
                    waveStrength={settings.voxelArcWaveStrength}
                    cellSize={settings.voxelArcCellSize}
                    hue={settings.voxelArcHue}
                  />
                  : settings.heroBackground === "terminal-rain"
                    ? <TerminalRain
                      preset={settings.terminalRainPreset}
                      mode={settings.terminalRainMode}
                      trailColor={settings.terminalRainTrailColor}
                      headColor={settings.terminalRainHeadColor}
                      backgroundColor={settings.terminalRainBackground}
                      characters={settings.terminalRainCharacters}
                      fontSize={settings.terminalRainFontSize}
                      spacing={settings.terminalRainSpacing}
                      trailLength={settings.terminalRainTrailLength}
                      speed={settings.terminalRainSpeed}
                      density={settings.terminalRainDensity}
                      variance={settings.terminalRainVariance}
                      angle={settings.terminalRainAngle}
                      shuffle={settings.terminalRainShuffle}
                      depth={settings.terminalRainDepth}
                      glow={settings.terminalRainGlow}
                      intensity={settings.terminalRainIntensity}
                      slowRadius={settings.terminalRainSlowRadius}
                      slowStrength={settings.terminalRainSlowStrength}
                      burstSize={settings.terminalRainBurstSize}
                      mirror={settings.terminalRainMirror}
                      bulletTime={settings.terminalRainBulletTime}
                      clickBurst={settings.terminalRainClickBurst}
                      interactive={settings.terminalRainInteractive}
                      cascade={settings.terminalRainCascade}
                      resolution={settings.terminalRainResolution}
                    />
                  : settings.heroBackground === "astral-shell"
                    ? <AstralShell
                      interactive={settings.astralShellInteractive}
                      draggable={settings.astralShellDraggable}
                      clickPulse={settings.astralShellClickPulse}
                      paused={settings.astralShellPaused}
                      backgroundColor={settings.astralShellBackground}
                      networkColor={settings.astralShellNetworkColor}
                      highlightColor={settings.astralShellHighlightColor}
                      pointCount={settings.astralShellPointCount}
                      connections={settings.astralShellConnections}
                      reach={settings.astralShellReach}
                      clustering={settings.astralShellClustering}
                      chords={settings.astralShellChords}
                      radius={settings.astralShellRadius}
                      originX={settings.astralShellOriginX}
                      originY={settings.astralShellOriginY}
                      rotationSpeed={settings.astralShellRotationSpeed}
                      globeScale={settings.astralShellScale}
                      nodeSize={settings.astralShellNodeSize}
                      depthFade={settings.astralShellDepthFade}
                      lineOpacity={settings.astralShellLineOpacity}
                      spin={settings.astralShellSpin}
                      tilt={settings.astralShellTilt}
                      hoverRadius={settings.astralShellHoverRadius}
                      hoverBoost={settings.astralShellHoverBoost}
                      pulseSpeed={settings.astralShellPulseSpeed}
                      seed={settings.astralShellSeed}
                    />
                    : settings.heroBackground === "ascii"
                      ? <GradientASCII />
                      : <div className={`admin-static-background admin-static-background-${settings.heroBackground}`} />}
              </FeatureSettingsContext.Provider>
            </div>
            {settings.heroBackground === "terminal-rain" && (
              <div className="admin-background-controls admin-background-controls-grid">
                <label className="admin-select-label">Preset
                  <select value={settings.terminalRainPreset} onChange={(event) => {
                    const preset = event.target.value;
                    setSettings((current) => ({ ...current, terminalRainPreset: preset, ...{
                      terminalRainTrailColor: terminalRainPresets[preset].trailColor,
                      terminalRainHeadColor: terminalRainPresets[preset].headColor,
                      terminalRainBackground: terminalRainPresets[preset].background,
                    } }));
                  }}>
                    {terminalRainPresetOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="admin-select-label">Mode
                  <select value={settings.terminalRainMode} onChange={(event) => updateAsciiSetting("terminalRainMode", event.target.value)}>
                    {terminalRainModes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                <label className="admin-select-label">Glyphs
                  <select value={terminalRainGlyphs.find(([value, , glyphs]) => value !== "custom" && glyphs === settings.terminalRainCharacters)?.[0] || "custom"}
                    onChange={(event) => updateAsciiSetting("terminalRainCharacters", terminalRainGlyphs.find(([value]) => value === event.target.value)?.[2] || settings.terminalRainCharacters)}>
                    {terminalRainGlyphs.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    <option value="custom">Custom</option>
                  </select>
                </label>
                {[
                  ["terminalRainTrailColor", "Trail", "color"],
                  ["terminalRainHeadColor", "Head", "color"],
                  ["terminalRainBackground", "Background", "color"],
                ].map(([key, label, type]) => <label className="admin-select-label" key={key}>{label}
                  <input type={type} value={settings[key]} onChange={(event) => updateAsciiSetting(key, event.target.value)} />
                </label>)}
                <label className="admin-select-label">
                  Custom glyphs
                  <input
                    value={settings.terminalRainCharacters}
                    maxLength={64}
                    onChange={(event) => updateAsciiSetting("terminalRainCharacters", event.target.value.replace(/[\r\n]/g, ""))}
                  />
                </label>
                <label className="admin-range-label">
                  <span><span>Trail length</span><strong>{settings.terminalRainTrailLength}</strong></span>
                  <input type="range" min="4" max="32" step="1" value={settings.terminalRainTrailLength}
                    onChange={(event) => updateAsciiSetting("terminalRainTrailLength", Number(event.target.value))} />
                </label>
                <label className="admin-range-label">
                  <span><span>                  Speed</span><strong>{settings.terminalRainSpeed.toFixed(1)}×</strong></span>
                  <input type="range" min="0.2" max="2" step="0.1" value={settings.terminalRainSpeed}
                    onChange={(event) => updateAsciiSetting("terminalRainSpeed", Number(event.target.value))} />
                </label>
                <label className="admin-range-label">
                  <span><span>                  Density</span><strong>{Math.round(settings.terminalRainDensity * 100)}%</strong></span>
                  <input type="range" min="0.1" max="1" step="0.05" value={settings.terminalRainDensity}
                    onChange={(event) => updateAsciiSetting("terminalRainDensity", Number(event.target.value))} />
                </label>
                <label className="admin-range-label">
                  <span><span>Glow</span><strong>{settings.terminalRainGlow.toFixed(2)}</strong></span>
                  <input type="range" min="0" max="1" step="0.05" value={settings.terminalRainGlow}
                    onChange={(event) => updateAsciiSetting("terminalRainGlow", Number(event.target.value))} />
                </label>
                <label className="admin-range-label">
                  <span><span>Resolution</span><strong>{Math.round(settings.terminalRainResolution * 100)}%</strong></span>
                  <input type="range" min="0.25" max="1" step="0.05" value={settings.terminalRainResolution}
                    onChange={(event) => updateAsciiSetting("terminalRainResolution", Number(event.target.value))} />
                </label>
                {[
                  ["terminalRainFontSize", "Glyph size", 10, 32, 1, (value) => `${value}px`],
                  ["terminalRainSpacing", "Spacing", 0.5, 2, 0.05, (value) => value.toFixed(2)],
                  ["terminalRainVariance", "Variance", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["terminalRainAngle", "Angle", -30, 30, 1, (value) => `${value}°`],
                  ["terminalRainShuffle", "Shuffle", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["terminalRainDepth", "Depth", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["terminalRainIntensity", "Intensity", 0.2, 2, 0.05, (value) => value.toFixed(2)],
                  ["terminalRainSlowRadius", "Slow radius", 0, 300, 10, (value) => `${value}px`],
                  ["terminalRainSlowStrength", "Slow strength", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["terminalRainBurstSize", "Burst size", 0.2, 2, 0.05, (value) => value.toFixed(2)],
                ].map(([key, label, min, max, step, format]) => <label className="admin-range-label" key={key}>
                  <span><span>{label}</span><strong>{format(settings[key])}</strong></span>
                  <input type="range" min={min} max={max} step={step} value={settings[key]}
                    onChange={(event) => updateAsciiSetting(key, Number(event.target.value))} />
                </label>)}
                <label className="admin-check-label"><input type="checkbox" checked={settings.terminalRainBulletTime}
                  onChange={(event) => updateAsciiSetting("terminalRainBulletTime", event.target.checked)} /> Bullet time</label>
                <label className="admin-check-label"><input type="checkbox" checked={settings.terminalRainClickBurst}
                  onChange={(event) => updateAsciiSetting("terminalRainClickBurst", event.target.checked)} /> Click burst</label>
                <label className="admin-check-label"><input type="checkbox" checked={settings.terminalRainMirror}
                  onChange={(event) => updateAsciiSetting("terminalRainMirror", event.target.checked)} /> Mirror</label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.terminalRainInteractive}
                    onChange={(event) => updateAsciiSetting("terminalRainInteractive", event.target.checked)} />
                  Interactive
                </label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.terminalRainCascade}
                    onChange={(event) => updateAsciiSetting("terminalRainCascade", event.target.checked)} />
                  Click cascades
                </label>
                <button type="button" className="reset-features ascii-save-button" onClick={() => saveSettings(settings, "Background settings saved and applied.")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save background settings"}
                </button>
              </div>
            )}
            {settings.heroBackground === "voxel-arc" && (
              <div className="admin-background-controls admin-background-controls-grid">
                <label className="admin-select-label">Preset
                  <select value={settings.voxelArcPreset} onChange={(event) => {
                    const preset = event.target.value;
                    setSettings((current) => ({ ...current, voxelArcPreset: preset, ...{
                      voxelArcColor: voxelArcPresets[preset].color,
                      voxelArcAccent: voxelArcPresets[preset].accent,
                      voxelArcBackground: voxelArcPresets[preset].background,
                    } }));
                  }}>
                    {voxelArcPresetOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                {[
                  ["voxelArcColor", "Color"],
                  ["voxelArcAccent", "Accent"],
                  ["voxelArcBackground", "Background"],
                ].map(([key, label]) => <label className="admin-select-label" key={key}>{label}
                  <input type="color" value={settings[key]} onChange={(event) => updateAsciiSetting(key, event.target.value)} />
                </label>)}
                {[
                  ["voxelArcDensity", "Density", 0.1, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcSize", "Voxel size", 0.2, 1, 0.01, (value) => value.toFixed(2)],
                  ["voxelArcRoundness", "Roundness", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcTilt", "Tilt", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcHorizon", "Horizon", 0.2, 0.8, 0.01, (value) => value.toFixed(2)],
                  ["voxelArcCurvature", "Curvature", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcWaveHeight", "Wave height", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcWaveLength", "Wave length", 0.2, 2, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcSpeed", "Speed", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcTurbulence", "Turbulence", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcBrightness", "Brightness", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcGlow", "Glow", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcHaze", "Haze", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcBloom", "Bloom", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcFocus", "Focus", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcAperture", "Aperture", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcGrain", "Grain", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["voxelArcRipples", "Ripples", 0, 2, 0.05, (value) => value.toFixed(2)],
                ].map(([key, label, min, max, step, format]) => <label className="admin-range-label" key={key}>
                  <span><span>{label}</span><strong>{format(settings[key])}</strong></span>
                  <input type="range" min={min} max={max} step={step} value={settings[key]}
                    onChange={(event) => updateAsciiSetting(key, Number(event.target.value))} />
                </label>)}
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.voxelArcInteractive}
                    onChange={(event) => updateAsciiSetting("voxelArcInteractive", event.target.checked)} /> Interactive
                </label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.voxelArcIntro}
                    onChange={(event) => updateAsciiSetting("voxelArcIntro", event.target.checked)} /> Intro
                </label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.voxelArcPaused}
                    onChange={(event) => updateAsciiSetting("voxelArcPaused", event.target.checked)} /> Paused
                </label>
                <button type="button" className="reset-features ascii-save-button" onClick={() => saveSettings(settings, "Voxel Arc settings saved and applied.")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Voxel Arc settings"}
                </button>
              </div>
            )}
            {settings.heroBackground === "astral-shell" && (
              <div className="admin-background-controls admin-background-controls-grid">
                <label className="admin-select-label">
                  Preset
                  <select
                    value={settings.astralShellPreset}
                    onChange={(event) => {
                      const preset = event.target.value;
                      setSettings((current) => ({
                        ...current,
                        astralShellPreset: preset,
                        astralShellBackground: astralShellPresets[preset].background,
                        astralShellNetworkColor: astralShellPresets[preset].networkColor,
                        astralShellHighlightColor: astralShellPresets[preset].highlightColor,
                      }));
                    }}
                  >
                    {astralShellPresetOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </label>
                {[
                  ["astralShellBackground", "Background", "color"],
                  ["astralShellNetworkColor", "Network", "color"],
                  ["astralShellHighlightColor", "Highlight", "color"],
                ].map(([key, label, type]) => (
                  <label className="admin-select-label" key={key}>
                    {label}
                    <input type={type} value={settings[key]}
                      onChange={(event) => updateAsciiSetting(key, event.target.value)} />
                  </label>
                ))}
                {[
                  ["astralShellPointCount", "Nodes", 100, 2400, 100, (value) => value],
                  ["astralShellConnections", "Connections", 1, 8, 1, (value) => value],
                  ["astralShellReach", "Reach", 0.05, 0.5, 0.01, (value) => value.toFixed(2)],
                  ["astralShellClustering", "Clustering", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["astralShellChords", "Chords", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["astralShellRadius", "Radius", 0.2, 0.8, 0.01, (value) => value.toFixed(2)],
                  ["astralShellOriginX", "Origin X", 0.1, 0.9, 0.01, (value) => value.toFixed(2)],
                  ["astralShellOriginY", "Origin Y", 0.1, 0.9, 0.01, (value) => value.toFixed(2)],
                  ["astralShellLineOpacity", "Line opacity", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["astralShellNodeSize", "Node size", 0.2, 2, 0.1, (value) => value.toFixed(1)],
                  ["astralShellDepthFade", "Depth fade", 0, 1, 0.05, (value) => value.toFixed(2)],
                  ["astralShellSpin", "Spin", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["astralShellTilt", "Tilt", 0, 45, 1, (value) => `${value}°`],
                  ["astralShellHoverRadius", "Hover radius", 0.05, 0.5, 0.01, (value) => value.toFixed(2)],
                  ["astralShellHoverBoost", "Hover boost", 0, 2, 0.05, (value) => value.toFixed(2)],
                  ["astralShellPulseSpeed", "Pulse speed", 0, 3, 0.1, (value) => value.toFixed(1)],
                  ["astralShellSeed", "Seed", 0, 100, 1, (value) => value],
                ].map(([key, label, min, max, step, format]) => (
                  <label className="admin-range-label" key={key}>
                    <span><span>{label}</span><strong>{format(settings[key])}</strong></span>
                    <input type="range" min={min} max={max} step={step} value={settings[key]}
                      onChange={(event) => updateAsciiSetting(key, Number(event.target.value))} />
                  </label>
                ))}
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.astralShellInteractive}
                    onChange={(event) => updateAsciiSetting("astralShellInteractive", event.target.checked)} />
                  Interactive
                </label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.astralShellDraggable}
                    onChange={(event) => updateAsciiSetting("astralShellDraggable", event.target.checked)} />
                  Draggable
                </label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.astralShellClickPulse}
                    onChange={(event) => updateAsciiSetting("astralShellClickPulse", event.target.checked)} />
                  Click pulse
                </label>
                <label className="admin-check-label">
                  <input type="checkbox" checked={settings.astralShellPaused}
                    onChange={(event) => updateAsciiSetting("astralShellPaused", event.target.checked)} />
                  Paused
                </label>
                <button type="button" className="reset-features ascii-save-button" onClick={() => saveSettings(settings, "Astral Shell settings saved and applied.")} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Astral Shell settings"}
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="vault-admin-settings" aria-labelledby="loader-settings-title">
          <div>
            <p className="vault-admin-eyebrow">Loading experience</p>
            <h2 id="loader-settings-title">Page loader</h2>
            <p>Choose the animation shown while lazy-loaded pages are preparing.</p>
          </div>
          <label className="admin-select-label" htmlFor="loader-style">
            Loader style
            <select
              id="loader-style"
              value={settings.loaderStyle}
              onChange={updateLoaderStyle}
            >
              {loaderOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <p className="admin-setting-hint">
            {loaderOptions.find(([value]) => value === settings.loaderStyle)?.[2]}
          </p>
        </section>

        <section className="vault-admin-ascii-settings" aria-labelledby="lenis-settings-title">
          <div className="vault-admin-ascii-heading">
            <p className="vault-admin-eyebrow">Scroll experience</p>
            <h2 id="lenis-settings-title">Lenis controls</h2>
            <p>Fine-tune smooth scrolling without editing code. Changes apply after the settings sync.</p>
          </div>
          {lenisOptions.map(([key, label, description, min, max, step, unit]) => (
            <label className="admin-range-label" key={key}>
              <span>
                <span>{label}</span>
                <strong>{settings[key]}{unit === "lerp" ? "" : "×"}</strong>
              </span>
              <small>{description}</small>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={settings[key]}
                onChange={(event) => updateAsciiSetting(key, Number(event.target.value))}
              />
            </label>
          ))}
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.lenisSmoothWheel}
              onChange={(event) => updateAsciiSetting("lenisSmoothWheel", event.target.checked)}
            />
            Smooth desktop wheel
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.lenisSyncTouch}
              onChange={(event) => updateAsciiSetting("lenisSyncTouch", event.target.checked)}
            />
            Sync touch scrolling
          </label>
          <button type="button" className="reset-features ascii-save-button" onClick={saveLenisSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Lenis settings"}
          </button>
        </section>

        <section className="vault-admin-settings" aria-labelledby="motion-settings-title">
          <div>
            <p className="vault-admin-eyebrow">GSAP motion lab</p>
            <h2 id="motion-settings-title">Animation preset</h2>
            <p>Change the personality of scroll reveals without adding another animation library.</p>
          </div>
          <label className="admin-select-label" htmlFor="motion-preset">
            Motion style
            <select
              id="motion-preset"
              value={settings.motionPreset}
              onChange={(event) => updateAsciiSetting("motionPreset", event.target.value)}
            >
              {motionPresetOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <p className="admin-setting-hint">
            {motionPresetOptions.find(([value]) => value === settings.motionPreset)?.[2]}
          </p>
          <button type="button" className="reset-features ascii-save-button" onClick={() => saveSettings(settings, "Motion preset saved and applied.")} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save motion preset"}
          </button>
        </section>

        <section className="vault-admin-ascii-settings vault-admin-toolkit-settings" aria-labelledby="toolkit-settings-title">
          <div className="vault-admin-ascii-heading">
            <p className="vault-admin-eyebrow">Toolkit section</p>
            <h2 id="toolkit-settings-title">Tools animation</h2>
            <p>Choose the amount of React Bits-style motion behind the technology chips.</p>
          </div>
          <label className="admin-select-label">
            Toolkit style
            <select
              value={settings.toolkitStyle}
              onChange={(event) => updateAsciiSetting("toolkitStyle", event.target.value)}
            >
              {toolkitStyleOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <small>{toolkitStyleOptions.find(([value]) => value === settings.toolkitStyle)?.[2]}</small>
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.toolkitChipMotion}
              onChange={(event) => updateAsciiSetting("toolkitChipMotion", event.target.checked)}
            />
            Animate tool chips on entry and hover
          </label>
          <button type="button" className="reset-features ascii-save-button" onClick={saveToolkitSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save toolkit settings"}
          </button>
        </section>

        {settings.heroBackground === "ascii" && (
          <section className="vault-admin-ascii-settings" aria-labelledby="ascii-settings-title">
            <div className="vault-admin-ascii-heading">
              <p className="vault-admin-eyebrow">Selected background · Gradient ASCII</p>
              <h2 id="ascii-settings-title">Background customisation</h2>
              <p>These controls are active because Gradient ASCII is the selected hero background.</p>
            </div>
          <label className="admin-select-label">
            Preset
            <select
              value={settings.asciiPreset}
              onChange={(event) => updateAsciiSetting("asciiPreset", event.target.value)}
            >
              {asciiPresetOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="admin-select-label">
            Characters
            <select
              value={settings.asciiCharacters}
              onChange={(event) => updateAsciiSetting("asciiCharacters", event.target.value)}
            >
              {asciiCharacterOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="admin-select-label">
            Color preset
            <select
              value={settings.asciiColorPreset}
              onChange={(event) => updateAsciiSetting("asciiColorPreset", event.target.value)}
            >
              {asciiColorOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          {settings.asciiCharacters === "custom" && (
            <label className="admin-select-label ascii-custom-characters-label">
              Custom characters
              <input
                type="text"
                value={settings.asciiCustomCharacters}
                maxLength={64}
                spellCheck="false"
                onChange={(event) => updateAsciiSetting(
                  "asciiCustomCharacters",
                  event.target.value.replace(/[\r\n]/g, "")
                )}
                placeholder=" .·:+*#@"
                aria-describedby="ascii-custom-characters-help"
              />
              <small id="ascii-custom-characters-help">
                Use at least two characters. Keep a leading space if you want the dimmest cells to stay blank.
              </small>
            </label>
          )}
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiDesktopMouseInteraction}
              onChange={(event) => updateAsciiSetting("asciiDesktopMouseInteraction", event.target.checked)}
            />
            Desktop mouse interaction
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiRandomCharacters}
              onChange={(event) => updateAsciiSetting("asciiRandomCharacters", event.target.checked)}
            />
            Random character mode
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiTextMode}
              onChange={(event) => updateAsciiSetting("asciiTextMode", event.target.checked)}
            />
            ASCII text/logo mode
          </label>
          {settings.asciiTextMode && (
            <label className="admin-select-label">
              ASCII text or logo
              <input
                type="text"
                maxLength={40}
                value={settings.asciiText}
                onChange={(event) => updateAsciiSetting("asciiText", event.target.value)}
                placeholder="AVJ"
              />
            </label>
          )}
          <label className="admin-range-label">
            <span><span>Animation speed</span><strong>{settings.asciiAnimationSpeed}×</strong></span>
            <input type="range" min="0" max="3" step="0.1" value={settings.asciiAnimationSpeed}
              onChange={(event) => updateAsciiSetting("asciiAnimationSpeed", Number(event.target.value))} />
          </label>
          <label className="admin-range-label">
            <span><span>Wave strength</span><strong>{settings.asciiWaveStrength}</strong></span>
            <input type="range" min="0" max="0.3" step="0.01" value={settings.asciiWaveStrength}
              onChange={(event) => updateAsciiSetting("asciiWaveStrength", Number(event.target.value))} />
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiMobileMouseInteraction}
              onChange={(event) => updateAsciiSetting("asciiMobileMouseInteraction", event.target.checked)}
            />
            Mobile touch interaction
          </label>
          <label className="admin-range-label">
            <span>
              <span>Desktop cell density</span>
              <strong>{settings.asciiDesktopCellSize}px spacing</strong>
            </span>
            <input
              type="range"
              min="8"
              max="24"
              step="1"
              value={settings.asciiDesktopCellSize}
              onChange={(event) => updateAsciiSetting("asciiDesktopCellSize", Number(event.target.value))}
            />
          </label>
          <label className="admin-range-label">
            <span>
              <span>Mobile cell density</span>
              <strong>{settings.asciiMobileCellSize}px spacing</strong>
            </span>
            <input
              type="range"
              min="10"
              max="32"
              step="1"
              value={settings.asciiMobileCellSize}
              onChange={(event) => updateAsciiSetting("asciiMobileCellSize", Number(event.target.value))}
            />
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiMouseInteraction}
              onChange={(event) => {
                const enabled = event.target.checked;
                setSettings((current) => ({
                  ...current,
                  asciiMouseInteraction: enabled,
                  asciiDesktopMouseInteraction: enabled,
                  asciiMobileMouseInteraction: enabled,
                }));
              }}
            />
            Enable both interactions
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiIntro}
              onChange={(event) => updateAsciiSetting("asciiIntro", event.target.checked)}
            />
            Intro glow
          </label>
          <label className="admin-check-label">
            <input
              type="checkbox"
              checked={settings.asciiLightMode}
              onChange={(event) => updateAsciiSetting("asciiLightMode", event.target.checked)}
            />
            Light ink
          </label>
          <button type="button" className="reset-features ascii-save-button" onClick={saveAsciiSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Gradient ASCII settings"}
          </button>
          {savedMessage && <p className="vault-admin-saved" role="status">{savedMessage}</p>}
          {saveError && <p className="vault-admin-error" role="alert">{saveError}</p>}
          </section>
        )}

        <section className="vault-admin-ascii-settings" aria-labelledby="theme-settings-title">
          <div className="vault-admin-ascii-heading">
            <p className="vault-admin-eyebrow">Brand system</p>
            <h2 id="theme-settings-title">Color presets</h2>
            <p>Use a controlled accent palette instead of arbitrary CSS values.</p>
          </div>
          <label className="admin-select-label">
            Website accent
            <select value={settings.accentPreset}
              onChange={(event) => updateAsciiSetting("accentPreset", event.target.value)}>
              {accentOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <button type="button" className="reset-features ascii-save-button" onClick={saveAsciiSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save color preset"}
          </button>
        </section>

        <section className="vault-admin-ascii-settings vault-admin-homepage-settings" aria-labelledby="hero-content-title">
          <div className="vault-admin-ascii-heading">
            <p className="vault-admin-eyebrow">Homepage content</p>
            <h2 id="hero-content-title">Hero text and visibility</h2>
            <p>Edit the homepage without changing the component source.</p>
          </div>
          <label className="admin-select-label">Eyebrow
            <input maxLength={120} value={settings.heroEyebrow}
              onChange={(event) => updateAsciiSetting("heroEyebrow", event.target.value)} />
          </label>
          <label className="admin-select-label">Title
            <input maxLength={180} value={settings.heroTitle}
              onChange={(event) => updateAsciiSetting("heroTitle", event.target.value)} />
          </label>
          <label className="admin-select-label">Subtitle
            <textarea
              maxLength={500}
              rows="6"
              value={settings.heroSubtitle}
              onChange={(event) => updateAsciiSetting("heroSubtitle", event.target.value)}
            />
          </label>
          <label className="admin-check-label"><input type="checkbox" checked={settings.showHeroProfile}
            onChange={(event) => updateAsciiSetting("showHeroProfile", event.target.checked)} /> Show profile image</label>
          <label className="admin-check-label"><input type="checkbox" checked={settings.showHeroActions}
            onChange={(event) => updateAsciiSetting("showHeroActions", event.target.checked)} /> Show hero buttons</label>
          <label className="admin-check-label"><input type="checkbox" checked={settings.showHeroCircle}
            onChange={(event) => updateAsciiSetting("showHeroCircle", event.target.checked)} /> Show hero circle</label>
          {[
            ["heroCircleSize", "Circle size", 0.5, 1.5, 0.05, (value) => `${Math.round(value * 100)}%`],
            ["heroCircleOpacity", "Circle opacity", 0, 1, 0.05, (value) => `${Math.round(value * 100)}%`],
          ].map(([key, label, min, max, step, format]) => <label className="admin-range-label" key={key}>
            <span><span>{label}</span><strong>{format(settings[key])}</strong></span>
            <input type="range" min={min} max={max} step={step} value={settings[key]}
              onChange={(event) => updateAsciiSetting(key, Number(event.target.value))} />
          </label>)}
          <button type="button" className="reset-features ascii-save-button" onClick={saveAsciiSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save homepage settings"}
          </button>
        </section>

        <section className="vault-admin-ascii-settings" aria-labelledby="contact-settings-title">
          <div className="vault-admin-ascii-heading">
            <p className="vault-admin-eyebrow">Contact experience</p>
            <h2 id="contact-settings-title">Submission notifications</h2>
            <p>Control whether visitors see send-status notifications and how long success messages remain visible.</p>
          </div>
          <label className="admin-check-label"><input type="checkbox" checked={settings.contactNotifications}
            onChange={(event) => updateAsciiSetting("contactNotifications", event.target.checked)} /> Show contact notifications</label>
          <p className="admin-setting-hint">Messages use the standard 5-second confirmation time.</p>
          <button type="button" className="reset-features ascii-save-button" onClick={saveAsciiSettings} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save contact settings"}
          </button>
        </section>

        <section className="vault-admin-preview">
          <div>
            <p className="vault-admin-eyebrow">React Bits preview</p>
            <h2>Interactive card layer</h2>
            <p>Move your pointer across the card to preview the same 3D tilt used on project previews.</p>
            <ul className="admin-interaction-details">
              <li><strong>Pointer tilt:</strong> follows cursor position on both axes.</li>
              <li><strong>Depth:</strong> image scales smoothly on hover.</li>
              <li><strong>Motion-safe:</strong> disabling the feature keeps a static image.</li>
            </ul>
            <button type="button" className="reset-features" onClick={resetFeatures}>
              Reset feature settings
            </button>
            {savedMessage && <p className="vault-admin-saved" role="status">{savedMessage}</p>}
            {saveError && <p className="vault-admin-error" role="alert">{saveError}</p>}
          </div>
          <div className="admin-card-preview">
            <TiltedCard
              imageSrc="/assets/logoavj-By6lVKnw.png"
              altText="AVJ logo preview"
              containerHeight="150px"
              imageHeight="150px"
              imageWidth="150px"
              scaleOnHover={1.04}
              rotateAmplitude={8}
              showMobileWarning={false}
              showTooltip={false}
              captionText="Pointer tilt · hover scale · 3D depth"
              displayOverlayContent
              overlayContent={<span className="admin-card-overlay">Move your pointer</span>}
              enabled={settings.reactBitsCards}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default VaultAdmin;
