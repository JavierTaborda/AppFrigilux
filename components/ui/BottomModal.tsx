
import { useThemeStore } from '@/stores/useThemeStore';
import React, { useEffect } from 'react';
import { Dimensions, Modal, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type BottomModalProps = {
    visible: boolean;
    onClose: () => void;
    heightPercentage?: number; // % height
    children: React.ReactNode; 
};

export default function BottomModal({
    visible,
    onClose,
    children,
    heightPercentage = 0.8,
}: BottomModalProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const screenHeight = Dimensions.get('window').height;
    const modalHeight = screenHeight * heightPercentage;

    const translateY = useSharedValue(modalHeight);
    const ANIMATION_CONFIG = {
        damping: 20,
        stiffness: 230,
        mass: 1,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    };

    // Show/Hide Modal
    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, ANIMATION_CONFIG);
        } else {
            translateY.value = withSpring(modalHeight, ANIMATION_CONFIG);
        }
    }, [visible]);

    // Drag an close
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

    // animate
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
            presentationStyle="overFullScreen"
            onRequestClose={onClose}     
        >
            <GestureHandlerRootView className="flex-1">

                <View className="flex-1 justify-end bg-overlay dark:bg-dark-overlay">
                    <Animated.View
                        style={[sheetStyle, { height: modalHeight }]}
                        className={`px-5 rounded-t-3xl bg-background dark:bg-dark-background`}
                    >
                        {/* Drag bar */}
                        <GestureDetector gesture={dragGesture}>
                            <View className="">
                                <View className="w-20 h-1.5 bg-neutral-400 self-center rounded-full mt-3 mb-3" />
                            </View>
                        </GestureDetector>
                        {/* Content */}
                        {children}
                    </Animated.View>
                </View>
            </GestureHandlerRootView>
        </Modal>
    );
}
