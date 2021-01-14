import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';

const BlockComponent = (props) => {
  const translateX = useSharedValue(props.startX);
  const translateY = useSharedValue(props.startY);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: withSpring(translateX.value)},
        {translateY: withSpring(translateY.value)},
      ],
    };
  });

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const styles = StyleSheet.create({
    box: {
      position: 'absolute',
      width: 80,
      height: 80,
      backgroundColor: 'black',
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      marginLeft: 0,
      borderRadius: 12,
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

      translateX.value = fixXPosition(context.startX + event.translationX);

      translateY.value = fixYPosition(context.startY + event.translationY);
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.box, animatedStyles]} />
    </PanGestureHandler>
  );
};

const App = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
  });
  return (
    <View style={styles.container}>
      <BlockComponent startX={0} startY={0} />
      <BlockComponent startX={0} startY={90} />
      <BlockComponent startX={0} startY={180} />
    </View>
  );
};

export default App;
