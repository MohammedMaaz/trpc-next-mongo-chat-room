import { useCallback, useEffect, useRef } from "react";

export function useOnScrollEndReached(
  onEndReached: (percent: number) => void,
  options?: {
    thresholdPercent?: number;
    debounceMs?: number;
    direction?: "up" | "down";
  }
) {
  const ref = useRef<HTMLElement | null>(null);
  const lastTime = useRef(0);
  const scheduled = useRef(false);
  const {
    thresholdPercent = 80,
    debounceMs = 1000,
    direction = "down",
  } = options || {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastScrollTop = direction === "down" ? Infinity : -Infinity;

    const onScroll: EventListener = (ev) => {
      const { clientHeight, scrollTop, scrollHeight } =
        ev.target as HTMLElement;

      //trigger only if scrolling in given direction
      const condition =
        direction === "down"
          ? scrollTop > lastScrollTop
          : scrollTop < lastScrollTop;

      if (condition) {
        const currentScroll = Math.abs(scrollTop);
        const maxScroll = scrollHeight - clientHeight;
        const currentPercent = (currentScroll / maxScroll) * 100;

        // trigger only if scrolled more than threshold
        if (currentPercent > thresholdPercent) {
          // trigger only if debounce time has passed
          if (Date.now() - lastTime.current > debounceMs) {
            onEndReached(currentPercent);
          }
          // schedule next call if debounce time has not passed
          else if (!scheduled.current) {
            scheduled.current = true;
            setTimeout(() => {
              scheduled.current = false;
              onEndReached(currentPercent);
            }, debounceMs);
          }
          lastTime.current = Date.now();
        }
      }
      lastScrollTop = scrollTop;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref.current, thresholdPercent, direction, onEndReached]);

  return { ref };
}
