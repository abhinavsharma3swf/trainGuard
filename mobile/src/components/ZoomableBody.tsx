import { ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

type Props = {
    children: ReactNode;
};

export default function ZoomableBody({ children }: Props) {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinch = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            scale.value = Math.min(
                Math.max(scale.value, 1),
                3,
            );

            savedScale.value = scale.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <GestureDetector gesture={pinch}>
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
}