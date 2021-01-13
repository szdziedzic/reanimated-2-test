import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';

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

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const styles = StyleSheet.create({
    box: {
      width: 80,
      height: 80,
      backgroundColor: 'black',
      marginTop: 35,
      marginBottom: 10,
      marginRight: 0,
      marginLeft: 0,
    },
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const fixXPosition = (wantedX) => {
        if (
          wantedX >
          screenWidth -
            (styles.box.width + styles.box.marginLeft + styles.box.marginRight)
        ) {
          wantedX =
            screenWidth -
            (styles.box.width + styles.box.marginRight + styles.box.marginLeft);
        } else if (wantedX < 0) {
          wantedX = 0;
        }
        return wantedX;
      };
      const fixYPosition = (wantedY) => {
        if (
          wantedY >
          screenHeight -
            (styles.box.height + styles.box.marginTop + styles.box.marginBottom)
        ) {
          wantedY =
            screenHeight -
            (styles.box.height +
              styles.box.marginTop +
              styles.box.marginBottom);
        } else if (wantedY < 0) {
          wantedY = 0;
        }
        return wantedY;
      };

      translateX.value = withSpring(
        fixXPosition(context.startX + event.translationX),
      );
      translateY.value = withSpring(
        fixYPosition(context.startY + event.translationY),
      );
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyles]} />
    </PanGestureHandler>
  );
}
