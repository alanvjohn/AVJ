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
  revealAnimations: true,
  cursor: true,
  reactBitsCards: true,
  heroBackground: "ascii",
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
  themeToastX: 16,
  themeToastY: 72,
  accentPreset: "blue",
  showHeroProfile: true,
  showHeroActions: true,
  heroEyebrow: "Technology · Learning · Building",
  heroTitle: "Learning, building, and exploring technology.",
  heroSubtitle: "I'm Alan V. John, a student at the University of Worcester in the UK, originally from Kerala. I enjoy learning technology, building useful applications, and improving my skills through practical projects.",
  contactNotifications: true,
  contactNotificationDuration: 5000,
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
  await setDoc(doc(db, "siteSettings", "appearance"), {
    lenis: nextSettings.lenis,
    revealAnimations: nextSettings.revealAnimations,
    cursor: nextSettings.cursor,
    reactBitsCards: nextSettings.reactBitsCards,
    heroBackground: nextSettings.heroBackground,
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
    themeToastX: nextSettings.themeToastX,
    themeToastY: nextSettings.themeToastY,
    lenisLerp: nextSettings.lenisLerp,
    lenisWheelMultiplier: nextSettings.lenisWheelMultiplier,
    lenisTouchMultiplier: nextSettings.lenisTouchMultiplier,
    lenisSyncTouch: nextSettings.lenisSyncTouch,
    lenisSmoothWheel: nextSettings.lenisSmoothWheel,
    accentPreset: nextSettings.accentPreset,
    showHeroProfile: nextSettings.showHeroProfile,
    showHeroActions: nextSettings.showHeroActions,
    heroEyebrow: nextSettings.heroEyebrow,
    heroTitle: nextSettings.heroTitle,
    heroSubtitle: nextSettings.heroSubtitle,
    contactNotifications: nextSettings.contactNotifications,
    contactNotificationDuration: nextSettings.contactNotificationDuration,
    updatedAt: serverTimestamp(),
  });
  localStorage.setItem(storageKey, JSON.stringify(nextSettings));
  return nextSettings;
}

export function subscribeFeatureSettings(onSettings, onRefresh) {
  return onSnapshot(doc(db, "siteSettings", "appearance"), (snapshot) => {
    if (!snapshot.exists()) return;

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
