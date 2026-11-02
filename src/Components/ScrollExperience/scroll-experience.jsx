import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeatureSettings } from "../../config/featureSettings";
import { useFeatureSettings } from "../../config/FeatureSettingsContext";

gsap.registerPlugin(ScrollTrigger);

function ScrollExperience() {
  const contextSettings = useFeatureSettings();

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const featureSettings = contextSettings || getFeatureSettings();
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const motionPresets = {
      calm: { duration: 1.05, y: 20, ease: "power2.out" },
      snappy: { duration: 0.45, y: 16, ease: "power3.out" },
      cinematic: { duration: 1.35, y: 42, ease: "power4.out" },
      cyber: { duration: 0.72, y: 28, ease: "expo.out" },
    };
    const motion = motionPresets[featureSettings.motionPreset] || motionPresets.cyber;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: Number(featureSettings.lenisLerp ?? (coarsePointer ? 0.1 : 0.08)),
      smoothWheel: Boolean(featureSettings.lenis && featureSettings.lenisSmoothWheel && !coarsePointer),
      syncTouch: Boolean(featureSettings.lenisSyncTouch && coarsePointer),
      wheelMultiplier: Number(featureSettings.lenisWheelMultiplier ?? 1),
      touchMultiplier: Number(featureSettings.lenisTouchMultiplier ?? 1),
    });
    lenis.on("scroll", ScrollTrigger.update);

    const animateScroll = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(animateScroll);
    gsap.ticker.lagSmoothing(0);

    const revealContext = gsap.context(() => {
      if (!reducedMotion && featureSettings.revealAnimations) {
        gsap.utils.toArray(".reveal-on-scroll").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: motion.y },
            {
              autoAlpha: 1,
              y: 0,
              duration: motion.duration,
              ease: motion.ease,
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      }
    });

    return () => {
      gsap.ticker.remove(animateScroll);
      revealContext.revert();
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, [contextSettings]);

  return null;
}

export default ScrollExperience;
