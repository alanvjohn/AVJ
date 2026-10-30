import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollExperience() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: coarsePointer ? 0.1 : 0.08,
      smoothWheel: !coarsePointer,
      syncTouch: false,
    });

    const animateScroll = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(animateScroll);
    gsap.ticker.lagSmoothing(0);

    const revealContext = gsap.context(() => {
      if (!reducedMotion) {
        gsap.utils.toArray(".reveal-on-scroll").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
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
      lenis.destroy();
    };
  }, []);

  return null;
}

export default ScrollExperience;
