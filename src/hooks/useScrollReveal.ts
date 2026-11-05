import { RefObject, useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  threshold = 0.2
): boolean {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, reducedMotion]);

  return isVisible;
}
