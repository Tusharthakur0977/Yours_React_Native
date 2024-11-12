import {
  backgroundColor,
  BackgroundColorProps,
  BorderProps,
  composeRestyleFunctions,
  layout,
  LayoutProps,
  SpacingProps,
  useRestyle,
} from '@shopify/restyle';
import {Theme} from 'foundation/theme';
import React from 'react';
import {SvgProps} from 'react-native-svg';

import {TouchableOpacity, TouchableOpacityProps} from './Button';
import {Icon} from './Icon';
type RestyleProps = BackgroundColorProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  LayoutProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  backgroundColor,
  layout,
]);

type IconButtonProps = RestyleProps & {
  onPress?: () => void;
  source: React.FC<SvgProps>;
  svgProps?: SvgProps;
};
export const IconButton: React.FC<IconButtonProps> = ({
  source,
  onPress,
  svgProps,
  ...rest
}) => {
  const props = useRestyle(restyleFunctions, {
    ...(rest as TouchableOpacityProps),
  });

  return (
    <TouchableOpacity
      backgroundColor={'transparent'}
      onPress={onPress}
      alignItems={'center'}
      justifyContent={'center'}
      alignContent={'center'}
      {...props}>
      <Icon source={source} svgProps={svgProps} />
    </TouchableOpacity>
  );
};
