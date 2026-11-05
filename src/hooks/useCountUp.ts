import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export function useCountUp(
  target: number,
  duration = 1400,
  startTrigger = true
): string {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState<number>(reducedMotion ? target : 0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (reducedMotion || !startTrigger || hasAnimated.current) {
      setCurrent(target);
      return;
    }

    hasAnimated.current = true;
    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const nextValue = Math.round(easedProgress * target);

      setCurrent(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, startTrigger, reducedMotion]);

  return current.toLocaleString("en-IN");
}
