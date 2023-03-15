import { useCallback, useEffect, useRef } from "react";
import debounce from "lodash.debounce";

export function useOnScrollEndReached(
  onEndReached: (percent: number) => void,
  options?: {
    thresholdPercent?: number;
    debounceMs?: number;
    direction?: "up" | "down";
  }
) {
  const ref = useRef<HTMLElement | null>(null);
  const {
    thresholdPercent = 80,
    debounceMs = 1000,
    direction = "down",
  } = options || {};

  const _onEndReached = useCallback(
    debounce(onEndReached, debounceMs, { leading: true, trailing: false }),
    [onEndReached]
  );

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
        if (currentPercent > thresholdPercent) _onEndReached(currentPercent);
      }
      lastScrollTop = scrollTop;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref.current, thresholdPercent, direction, _onEndReached]);

  return { ref };
}
