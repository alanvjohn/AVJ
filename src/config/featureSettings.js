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
  asciiMouseInteraction: true,
  asciiIntro: false,
  asciiLightMode: false,
};

const storageKey = "avj-feature-settings-v2";

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
    asciiMouseInteraction: nextSettings.asciiMouseInteraction,
    asciiIntro: nextSettings.asciiIntro,
    asciiLightMode: nextSettings.asciiLightMode,
    updatedAt: serverTimestamp(),
  });
  return nextSettings;
}
