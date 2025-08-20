
import { useRef, useState } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export function useScrollHeader() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollDirection = useRef<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentY = event.nativeEvent.contentOffset.y;
        const lastY = lastScrollY.current;

        if (currentY > 300 && !showScrollTop) {
          setShowScrollTop(true);
        } else if (currentY <= 300 && showScrollTop) {
          setShowScrollTop(false);
        }

        if (currentY <= 0 && !headerVisible) {
          setHeaderVisible(true);
          scrollDirection.current = 'up';
        }

        const delta = currentY - lastY;
        if (Math.abs(delta) > 15) {
          if (delta > 0 && scrollDirection.current !== 'down') {
            scrollDirection.current = 'down';
            setHeaderVisible(false);
          } else if (delta < 0 && scrollDirection.current !== 'up') {
            scrollDirection.current = 'up';
            setHeaderVisible(true);
          }
        }

        lastScrollY.current = currentY;
      },
    }
  );

  return {
    scrollY,
    handleScroll,
    headerVisible,
    showScrollTop,
    setHeaderVisible,
    setShowScrollTop,
  };
}