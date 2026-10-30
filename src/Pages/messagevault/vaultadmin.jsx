import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ADMIN_EMAIL,
  auth,
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
  ["shape-grid", "Shape Grid", "Animated perspective shapes for a geometric loading state."],
  ["dot-grid", "Dot Grid", "A springy animated dot pattern for a lighter loading state."],
  ["classic", "Classic", "The original compact AVJ loading indicator."],
];

function VaultAdmin() {
  const [user, setUser] = useState(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [settings, setSettings] = useState(getFeatureSettings);
  const [savedMessage, setSavedMessage] = useState("");

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

  const updateFeature = (feature) => {
    const nextSettings = saveFeatureSettings({
      ...settings,
      [feature]: !settings[feature],
    });
    setSettings(nextSettings);
    setSavedMessage("Saved. Refreshing this page to apply the change...");
    window.setTimeout(() => window.location.reload(), 500);
  };

  const resetFeatures = () => {
    saveFeatureSettings(defaultFeatureSettings);
    window.location.reload();
  };

  const updateHeroBackground = (event) => {
    const nextSettings = saveFeatureSettings({
      ...settings,
      heroBackground: event.target.value,
    });
    setSettings(nextSettings);
    setSavedMessage("Hero background saved. Refreshing...");
    window.setTimeout(() => window.location.reload(), 500);
  };

  const updateLoaderStyle = (event) => {
    const nextSettings = saveFeatureSettings({
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
