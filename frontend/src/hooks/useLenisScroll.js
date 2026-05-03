import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useLenisScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
      autoRaf: false,
    });

    window.__lenis = lenis;

    const onScroll = () => {
      ScrollTrigger.update();
    };

    const onRefresh = () => {
      lenis.resize();
    };

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on('scroll', onScroll);
    ScrollTrigger.addEventListener('refresh', onRefresh);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
}
