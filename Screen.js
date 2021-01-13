import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import React from 'react';

export default function AnimatedStyleUpdateExample(props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = withSpring(context.startX + event.translationX);
      translateY.value = withSpring(context.startY + event.translationY);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          {width: 80, height: 80, backgroundColor: 'black', margin: 30},
          animatedStyles,
        ]}
      />
    </PanGestureHandler>
  );
}
