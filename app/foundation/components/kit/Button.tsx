/* eslint-disable react-native/no-inline-styles */
import {Theme} from '@foundation/theme';
import {ButtonVariant} from '@foundation/theme/buttonsVariants';
import {TextVariant} from '@foundation/theme/textVariants';
import {
  backgroundColor,
  BackgroundColorProps,
  border,
  BorderProps,
  composeRestyleFunctions,
  createBox,
  createRestyleComponent,
  createVariant,
  LayoutProps,
  spacing,
  SpacingProps,
  useRestyle,
  VariantProps,
} from '@shopify/restyle';
import {Text} from 'foundation/components/kit/';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps as RNTouchableOpacityProps,
  ViewProps,
} from 'react-native';

import {colors} from 'foundation/theme/colors';
import {View} from './View';
import fonts from 'foundation/assets/fonts';

const buttonVariant = createVariant({themeKey: 'buttonVariants'});
const ButtonContainer = createRestyleComponent<
  VariantProps<Theme, 'buttonVariants'> & React.ComponentProps<typeof View>,
  Theme
>([buttonVariant], View);

export const TouchableOpacity = createBox<
  Theme,
  PropsWithChildren<RNTouchableOpacityProps>
>(RNTouchableOpacity);
export type TouchableOpacityProps = React.ComponentProps<
  typeof TouchableOpacity
>;

const restyleFunctions = composeRestyleFunctions([
  buttonVariant as any,
  spacing,
  border,
  backgroundColor,
]);

type Props = LayoutProps<Theme> &
  SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'> &
  BorderProps<Theme> &
  ViewProps &
  BackgroundColorProps<Theme> & {
    onPress: () => void;
    label?: string;
    loading?: boolean;
    children?: any;
    variant?: ButtonVariant;
    disabled?: boolean;
    textTransform?: 'uppercase' | 'lowercase' | 'none' | 'capitalize';
    numberOfLines?: number;
    width?: number;
    height?: number;
    fontSize?: number;
    loaderColor?: string;
  };

export const Button = ({
  onPress,
  label,
  loading = false,
  variant = 'regular_primary',
  children,
  disabled,
  textTransform,
  numberOfLines,
  fontSize,
  loaderColor = colors.white,
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, {...rest, variant});
  const [animatedValue] = useState(new Animated.Value(0));
  useEffect(() => {
    if (!loading) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500, // Adjust duration as needed
        useNativeDriver: true,
      }).start();
    }
  }, [loading, animatedValue]);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Adjust the distance of slide-up animation
  });

  const textVariant = `button_${variant}` as TextVariant;

  return (
    <ButtonContainer
      style={{width: props.width, height: props.height}}
      flexDirection={'row'}>
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={() => {
          if (!loading) {
            onPress();
          }
        }}
        flexDirection={'row'}
        justifyContent="center"
        alignItems={'center'}
        opacity={disabled ? 0.5 : 1}
        {...props}>
           <Animated.View style={{ transform: [{ translateY }] }}>
        {children}

        {loading ? (
          <ActivityIndicator style={{}} size="small" color={loaderColor} />
        ) : (
          <Text
            variant={textVariant}
            textTransform={textTransform}
            numberOfLines={numberOfLines}
            adjustsFontSizeToFit={numberOfLines === 1}
            textAlign="center"
            fontSize={fontSize}>
            {label}
          </Text>
        )}
        </Animated.View>
      </TouchableOpacity>
    </ButtonContainer>
  );
};
