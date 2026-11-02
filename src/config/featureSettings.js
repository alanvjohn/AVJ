import {
  db,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "../Pages/contact/firebase";

export const defaultFeatureSettings = {
  lenis: true,
  lenisLerp: 0.08,
  lenisWheelMultiplier: 1,
  lenisTouchMultiplier: 1,
  lenisSyncTouch: false,
  lenisSmoothWheel: true,
  motionPreset: "cyber",
  toolkitStyle: "cyber-field",
  toolkitChipMotion: true,
  revealAnimations: true,
  cursor: true,
  reactBitsCards: true,
  heroBackground: "ascii",
  voxelArcInteractive: true,
  voxelArcPaused: false,
  voxelArcWaveStrength: 5,
  voxelArcCellSize: 18,
  voxelArcHue: 205,
  astralShellInteractive: true,
  astralShellDraggable: true,
  astralShellClickPulse: true,
  astralShellPaused: false,
  astralShellPreset: "violet",
  astralShellBackground: "#0a0a0a",
  astralShellNetworkColor: "#7c6bff",
  astralShellHighlightColor: "#ffe6fa",
  astralShellPointCount: 150,
  astralShellConnections: 4,
  astralShellReach: 0.2,
  astralShellClustering: 0.85,
  astralShellChords: 0.35,
  astralShellRadius: 0.4,
  astralShellOriginX: 0.5,
  astralShellOriginY: 0.5,
  astralShellRotationSpeed: 0.0025,
  astralShellScale: 0.32,
  astralShellNodeSize: 0.8,
  astralShellDepthFade: 0.7,
  astralShellLineOpacity: 1,
  astralShellSpin: 1,
  astralShellTilt: 18,
  astralShellHoverRadius: 0.22,
  astralShellHoverBoost: 1,
  astralShellPulseSpeed: 1.2,
  astralShellSeed: 0,
  terminalRainCharacters: "01アイウエオカキクケコ",
  terminalRainTrailLength: 16,
  terminalRainSpeed: 1,
  terminalRainDensity: 0.45,
  terminalRainGlow: 0.22,
  terminalRainInteractive: true,
  terminalRainCascade: true,
  terminalRainResolution: 0.7,
  loaderStyle: "letter-glitch",
  asciiPreset: "atmosphere",
  asciiCharacters: "classic",
  asciiCustomCharacters: " .·:+*#@",
  asciiRandomCharacters: false,
  asciiTextMode: false,
  asciiText: "AVJ",
  asciiAnimationSpeed: 1,
  asciiWaveStrength: 0.08,
  asciiColorPreset: "atmosphere",
  asciiMouseInteraction: true,
  asciiDesktopCellSize: 10,
  asciiMobileCellSize: 16,
  asciiDesktopMouseInteraction: true,
  asciiMobileMouseInteraction: true,
  asciiIntro: false,
  asciiLightMode: false,
  accentPreset: "blue",
  showHeroProfile: true,
  showHeroActions: true,
  heroEyebrow: "Technology · Learning · Building",
  heroTitle: "Learning, building, and exploring technology.",
  heroSubtitle: "I'm Alan V. John, a student at the University of Worcester in the UK, originally from Kerala. I enjoy learning technology, building useful applications, and improving my skills through practical projects.",
  contactNotifications: true,
};

const storageKey = "avj-feature-settings-v2";
const pendingStorageKey = "avj-feature-settings-pending";
export const featureSettingsUpdatedEvent = "avj-feature-settings-updated";

export function applyFeatureSettingsLocally(settings) {
  const nextSettings = { ...defaultFeatureSettings, ...settings };
  localStorage.setItem(storageKey, JSON.stringify(nextSettings));
  window.dispatchEvent(new CustomEvent(featureSettingsUpdatedEvent, {
    detail: nextSettings,
  }));
  return nextSettings;
}

function hasPendingFeatureSettings() {
  return localStorage.getItem(pendingStorageKey) === "true";
}

export function getFeatureSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return { ...defaultFeatureSettings, ...stored };
  } catch {
    return { ...defaultFeatureSettings };
  }
}

export async function loadFeatureSettings() {
  try {
    const snapshot = await getDoc(doc(db, "siteSettings", "appearance"));
    if (hasPendingFeatureSettings()) return getFeatureSettings();
    if (!snapshot.exists()) return getFeatureSettings();

    const nextSettings = { ...defaultFeatureSettings, ...snapshot.data() };
    applyFeatureSettingsLocally(nextSettings);
    return nextSettings;
  } catch (error) {
    console.error("Unable to load public site settings:", error);
    return getFeatureSettings();
  }
}

export async function saveFeatureSettings(settings) {
  const nextSettings = { ...defaultFeatureSettings, ...settings };
  localStorage.setItem(pendingStorageKey, "true");
  await setDoc(doc(db, "siteSettings", "appearance"), {
    lenis: nextSettings.lenis,
    revealAnimations: nextSettings.revealAnimations,
    cursor: nextSettings.cursor,
    reactBitsCards: nextSettings.reactBitsCards,
    heroBackground: nextSettings.heroBackground,
    voxelArcInteractive: nextSettings.voxelArcInteractive,
    voxelArcPaused: nextSettings.voxelArcPaused,
    voxelArcWaveStrength: nextSettings.voxelArcWaveStrength,
    voxelArcCellSize: nextSettings.voxelArcCellSize,
    voxelArcHue: nextSettings.voxelArcHue,
    astralShellInteractive: nextSettings.astralShellInteractive,
    astralShellDraggable: nextSettings.astralShellDraggable,
    astralShellClickPulse: nextSettings.astralShellClickPulse,
    astralShellPaused: nextSettings.astralShellPaused,
    astralShellPreset: nextSettings.astralShellPreset,
    astralShellBackground: nextSettings.astralShellBackground,
    astralShellNetworkColor: nextSettings.astralShellNetworkColor,
    astralShellHighlightColor: nextSettings.astralShellHighlightColor,
    astralShellPointCount: nextSettings.astralShellPointCount,
    astralShellConnections: nextSettings.astralShellConnections,
    astralShellReach: nextSettings.astralShellReach,
    astralShellClustering: nextSettings.astralShellClustering,
    astralShellChords: nextSettings.astralShellChords,
    astralShellRadius: nextSettings.astralShellRadius,
    astralShellOriginX: nextSettings.astralShellOriginX,
    astralShellOriginY: nextSettings.astralShellOriginY,
    astralShellRotationSpeed: nextSettings.astralShellRotationSpeed,
    astralShellScale: nextSettings.astralShellScale,
    astralShellNodeSize: nextSettings.astralShellNodeSize,
    astralShellDepthFade: nextSettings.astralShellDepthFade,
    astralShellLineOpacity: nextSettings.astralShellLineOpacity,
    astralShellSpin: nextSettings.astralShellSpin,
    astralShellTilt: nextSettings.astralShellTilt,
    astralShellHoverRadius: nextSettings.astralShellHoverRadius,
    astralShellHoverBoost: nextSettings.astralShellHoverBoost,
    astralShellPulseSpeed: nextSettings.astralShellPulseSpeed,
    astralShellSeed: nextSettings.astralShellSeed,
    terminalRainCharacters: nextSettings.terminalRainCharacters,
    terminalRainTrailLength: nextSettings.terminalRainTrailLength,
    terminalRainSpeed: nextSettings.terminalRainSpeed,
    terminalRainDensity: nextSettings.terminalRainDensity,
    terminalRainGlow: nextSettings.terminalRainGlow,
    terminalRainInteractive: nextSettings.terminalRainInteractive,
    terminalRainCascade: nextSettings.terminalRainCascade,
    terminalRainResolution: nextSettings.terminalRainResolution,
    loaderStyle: nextSettings.loaderStyle,
    asciiPreset: nextSettings.asciiPreset,
    asciiCharacters: nextSettings.asciiCharacters,
    asciiCustomCharacters: nextSettings.asciiCustomCharacters,
    asciiRandomCharacters: nextSettings.asciiRandomCharacters,
    asciiTextMode: nextSettings.asciiTextMode,
    asciiText: nextSettings.asciiText,
    asciiAnimationSpeed: nextSettings.asciiAnimationSpeed,
    asciiWaveStrength: nextSettings.asciiWaveStrength,
    asciiColorPreset: nextSettings.asciiColorPreset,
    asciiMouseInteraction: nextSettings.asciiMouseInteraction,
    asciiDesktopCellSize: nextSettings.asciiDesktopCellSize,
    asciiMobileCellSize: nextSettings.asciiMobileCellSize,
    asciiDesktopMouseInteraction: nextSettings.asciiDesktopMouseInteraction,
    asciiMobileMouseInteraction: nextSettings.asciiMobileMouseInteraction,
    asciiIntro: nextSettings.asciiIntro,
    asciiLightMode: nextSettings.asciiLightMode,
    lenisLerp: nextSettings.lenisLerp,
    lenisWheelMultiplier: nextSettings.lenisWheelMultiplier,
    lenisTouchMultiplier: nextSettings.lenisTouchMultiplier,
    lenisSyncTouch: nextSettings.lenisSyncTouch,
    lenisSmoothWheel: nextSettings.lenisSmoothWheel,
    motionPreset: nextSettings.motionPreset,
    toolkitStyle: nextSettings.toolkitStyle,
    toolkitChipMotion: nextSettings.toolkitChipMotion,
    accentPreset: nextSettings.accentPreset,
    showHeroProfile: nextSettings.showHeroProfile,
    showHeroActions: nextSettings.showHeroActions,
    heroEyebrow: nextSettings.heroEyebrow,
    heroTitle: nextSettings.heroTitle,
    heroSubtitle: nextSettings.heroSubtitle,
    contactNotifications: nextSettings.contactNotifications,
    updatedAt: serverTimestamp(),
  });
  localStorage.removeItem(pendingStorageKey);
  applyFeatureSettingsLocally(nextSettings);
  return nextSettings;
}

export function subscribeFeatureSettings(onSettings, onRefresh) {
  return onSnapshot(doc(db, "siteSettings", "appearance"), (snapshot) => {
    if (!snapshot.exists()) return;
    if (hasPendingFeatureSettings()) return;

    const data = snapshot.data();
    onSettings({ ...defaultFeatureSettings, ...data });
    if (data.refreshAt) onRefresh(data.refreshAt);
  }, (error) => {
    console.error("Unable to subscribe to public site settings:", error);
  });
}

export async function requestVisitorRefresh() {
  await setDoc(doc(db, "siteSettings", "appearance"), {
    refreshAt: serverTimestamp(),
  }, { merge: true });
}
