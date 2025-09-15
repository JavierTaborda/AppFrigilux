import React, { forwardRef, useEffect } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  StatusBar,
  View,
  ViewProps,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";


import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomModalProps = {
  visible: boolean;
  onClose: () => void;
  heightPercentage?: number;
  children: React.ReactNode;
};

// SDK 54
const AnimatedView = forwardRef<View, ViewProps>((props, ref) => (
  <Animated.View ref={ref} {...props} />
));

export default function BottomModal({
  visible,
  onClose,
  children,
  heightPercentage = 0.8,
}: BottomModalProps) {
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get("window").height;
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;
  const modalHeight =
    (windowHeight - statusBarHeight) * heightPercentage + insets.bottom;

  const translateY = useSharedValue(modalHeight);
  const ANIMATION_CONFIG = {
    damping: 20,
    stiffness: 230,
    mass: 1,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  useEffect(() => {
    translateY.value = withSpring(visible ? 0 : modalHeight, ANIMATION_CONFIG);
  }, [visible, modalHeight]);

  const dragGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 120 || event.velocityY > 800) {
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, ANIMATION_CONFIG);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    bottom: 0,
    left: 0,
    right: 0,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end bg-overlay dark:bg-dark-overlay">
          <AnimatedView
            style={[
              sheetStyle,
              {
                height: modalHeight,
                paddingBottom: insets.bottom,
              },
            ]}
            className="px-5 rounded-t-3xl bg-background dark:bg-dark-background"
          >
            <GestureDetector gesture={dragGesture}>
              <View>
                <View className="w-20 h-1.5 bg-neutral-400 self-center rounded-full mt-3 mb-3" />
              </View>
            </GestureDetector>
            {children}
          </AnimatedView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
