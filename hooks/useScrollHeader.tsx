import { useState } from 'react';
import { runOnJS, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

export function useScrollHeader() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const scrollDirection = useSharedValue<'up' | 'down'>('up');

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      const lastY = lastScrollY.value;

      // Para mostrar botón scroll top
      if (currentY > 200 && !showScrollTop) {
        runOnJS(setShowScrollTop)(true);
      } else if (currentY <= 200 && showScrollTop) {
        runOnJS(setShowScrollTop)(false);
      }

      // Mostrar/ocultar header
      if (currentY <= 0 && !headerVisible) {
        runOnJS(setHeaderVisible)(true);
        scrollDirection.value = 'up';
      }

      const delta = currentY - lastY;
      if (Math.abs(delta) > 15) {
        if (delta > 0 && scrollDirection.value !== 'down') {
          scrollDirection.value = 'down';
          runOnJS(setHeaderVisible)(false);
        } else if (delta < 0 && scrollDirection.value !== 'up') {
          scrollDirection.value = 'up';
          runOnJS(setHeaderVisible)(true);
        }
      }

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
  });

  return {
    scrollY,
    handleScroll,
    headerVisible,
    showScrollTop,
    setHeaderVisible,
    setShowScrollTop,
  };
}