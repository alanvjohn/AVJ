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
import {
  defaultFeatureSettings,
  getFeatureSettings,
  saveFeatureSettings,
} from "../../config/featureSettings";
import "./vaultadmin.css";

const featureLabels = {
  lenis: ["Lenis smooth scroll", "Soft wheel scrolling for desktop visitors."],
  revealAnimations: ["Scroll reveals", "GSAP entrance motion for page sections."],
  cursor: ["Interactive cursor", "Desktop-only cursor ring and hover feedback."],
  reactBitsCards: ["React Bits card tilt", "Subtle 3D interaction on project previews."],
};

const heroBackgroundOptions = [
  ["ascii", "ASCII gradient", "Animated characters that respond to the pointer."],
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

function VaultAdmin() {
  const [user, setUser] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [settings, setSettings] = useState(getFeatureSettings);
  const [savedMessage, setSavedMessage] = useState("");
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

  const updateFeature = async (feature) => {
    const nextSettings = await saveFeatureSettings({
      ...settings,
      [feature]: !settings[feature],
    });
    setSettings(nextSettings);
    setSavedMessage("Saved. Refreshing this page to apply the change...");
    window.setTimeout(() => window.location.reload(), 500);
  };

  const resetFeatures = async () => {
    await saveFeatureSettings(defaultFeatureSettings);
    window.location.reload();
  };

  const updateHeroBackground = async (event) => {
    const nextSettings = await saveFeatureSettings({
      ...settings,
      heroBackground: event.target.value,
    });
    setSettings(nextSettings);
    setSavedMessage("Hero background saved. Refreshing...");
    window.setTimeout(() => window.location.reload(), 500);
  };

  const updateLoaderStyle = async (event) => {
    const nextSettings = await saveFeatureSettings({
      ...settings,
      loaderStyle: event.target.value,
    });
    setSettings(nextSettings);
    setSavedMessage("Loader style saved. Refreshing...");
    window.setTimeout(() => window.location.reload(), 500);
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
            <Link to="/vault" className="vault-admin-link">Back to Vault</Link>
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

        <section className="vault-admin-settings" aria-labelledby="hero-settings-title">
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

        <section className="vault-admin-preview">
          <div>
            <p className="vault-admin-eyebrow">React Bits preview</p>
            <h2>Interactive card layer</h2>
            <p>Preview the card interaction before enabling it for project visitors.</p>
            <button type="button" className="reset-features" onClick={resetFeatures}>
              Reset feature settings
            </button>
            {savedMessage && <p className="vault-admin-saved" role="status">{savedMessage}</p>}
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
              enabled={settings.reactBitsCards}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default VaultAdmin;
