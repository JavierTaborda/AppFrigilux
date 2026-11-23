import { useCallback, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export function useScrollHeader() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("up");
  const accumulatedScroll = useRef(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentY = event.nativeEvent.contentOffset.y;

      // Show scroll-to-top button
      if (currentY > 200 && !showScrollTop) {
        setShowScrollTop(true);
      } else if (currentY <= 200 && showScrollTop) {
        setShowScrollTop(false);
      }

      // Show/hide header
      if (currentY <= 0) {
        if (!headerVisible) setHeaderVisible(true);
        scrollDirection.current = "up";
        accumulatedScroll.current = 0;
      }

      const delta = currentY - lastScrollY.current;
      if (currentY > 0 && Math.abs(delta) > 1) {
        const nextDirection = delta > 0 ? "down" : "up";

        if (scrollDirection.current !== nextDirection) {
          scrollDirection.current = nextDirection;
          accumulatedScroll.current = 0;
        }

        accumulatedScroll.current += Math.abs(delta);

        if (accumulatedScroll.current >= 48) {
          if (nextDirection === "down" && headerVisible) {
            setHeaderVisible(false);
          } else if (nextDirection === "up" && !headerVisible) {
            setHeaderVisible(true);
          }
          accumulatedScroll.current = 0;
        }
      }

      lastScrollY.current = currentY;
    },
    [headerVisible, showScrollTop]
  );

  return {
    handleScroll,
    headerVisible,
    showScrollTop,
    setHeaderVisible,
    setShowScrollTop,
  };
}
