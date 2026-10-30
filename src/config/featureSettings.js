import {
  db,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "../Pages/contact/firebase";

export const defaultFeatureSettings = {
  lenis: true,
  revealAnimations: true,
  cursor: true,
  reactBitsCards: true,
  heroBackground: "ascii",
  loaderStyle: "letter-glitch",
  asciiPreset: "atmosphere",
  asciiCharacters: "classic",
  asciiCellSize: 15,
  asciiDensity: 0.8,
  asciiOpacity: 0.75,
  asciiGlow: 0.2,
  asciiSpeed: 1,
  asciiGrain: 0.08,
  asciiMouseInteraction: true,
  asciiIntro: true,
  asciiLightMode: false,
};

const storageKey = "avj-feature-settings";

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
    if (!snapshot.exists()) return getFeatureSettings();

    const nextSettings = { ...defaultFeatureSettings, ...snapshot.data() };
    localStorage.setItem(storageKey, JSON.stringify(nextSettings));
    return nextSettings;
  } catch (error) {
    console.error("Unable to load public site settings:", error);
    return getFeatureSettings();
  }
}

export async function saveFeatureSettings(settings) {
  const nextSettings = { ...defaultFeatureSettings, ...settings };
  localStorage.setItem(storageKey, JSON.stringify(nextSettings));
  await setDoc(doc(db, "siteSettings", "appearance"), {
    heroBackground: nextSettings.heroBackground,
    loaderStyle: nextSettings.loaderStyle,
    asciiPreset: nextSettings.asciiPreset,
    asciiCharacters: nextSettings.asciiCharacters,
    asciiCellSize: nextSettings.asciiCellSize,
    asciiDensity: nextSettings.asciiDensity,
    asciiOpacity: nextSettings.asciiOpacity,
    asciiGlow: nextSettings.asciiGlow,
    asciiSpeed: nextSettings.asciiSpeed,
    asciiGrain: nextSettings.asciiGrain,
    asciiMouseInteraction: nextSettings.asciiMouseInteraction,
    asciiIntro: nextSettings.asciiIntro,
    asciiLightMode: nextSettings.asciiLightMode,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  return nextSettings;
}
