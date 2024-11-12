import {View} from '@foundation/components/kit/View';
import {Theme} from '@foundation/theme';
import {
  BackgroundColorProps,
  BorderProps,
  LayoutProps,
  SpacingProps,
} from '@shopify/restyle';
import React, {memo} from 'react';
import {ViewStyle} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';

type RestyleProps = LayoutProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;

type CustomImageProps = RestyleProps &
  FastImageProps & {
    containerStyle?: ViewStyle;
    width?: number;
    height?: number;
  };

export const Image: React.FC<CustomImageProps> = memo(
  ({
    source,
    style,
    containerStyle,
    width,
    height,
    ...props
  }: CustomImageProps) => {
    return (
      <View
        alignItems={'center'}
        justifyContent={'center'}
        style={[containerStyle, {width: width, height: height}]}>
        <FastImage
          style={[style, {width: width, height: height}]}
          source={source}
          {...props}
        />
      </View>
    );
  },
);
