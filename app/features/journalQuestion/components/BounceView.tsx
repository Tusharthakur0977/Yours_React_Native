import fonts from 'foundation/assets/fonts';
import {Icons} from 'foundation/assets/icons';
import {Icon, Text, View} from 'foundation/components/kit';
import {useEffect, useRef} from 'react';
import {Animated} from 'react-native';

const BouncingView = () => {
  // Create an animated value
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define the bouncing animation sequence
    const bouncingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    // Start the animation
    bouncingAnimation.start();

    return () => bouncingAnimation.stop(); // Stop animation on component unmount
  }, [bounceAnim]);

  // Interpolate the animation value for translation
  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -4], // Change 50 to whatever height you want to bounce
  });

  return (
    <View
      alignItems={'center'}
      flexDirection={'row'}
      gap={'sp4'}
      justifyContent={'flex-end'}>
      <Text color={'gray1'} fontSize={13} fontFamily={fonts.HelveticaBold}>
        Scroll Down for Save Question
      </Text>
      <Animated.View
        style={{
          transform: [{translateY}],
        }}>
        <View style={{transform: [{rotate: '270deg'}]}}>
          <Icon
            source={Icons.ArrowLeftDark}
            svgProps={{
              fill: 'gray',
            }}
            height={13}
            width={13}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default BouncingView;
