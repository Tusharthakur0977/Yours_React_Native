import {Theme} from '@foundation/theme';
import {
  backgroundColor,
  BackgroundColorProps,
  BorderProps,
  composeRestyleFunctions,
  layout,
  LayoutProps,
  PositionProps,
  spacing,
  SpacingProps,
  useRestyle,
} from '@shopify/restyle';
import React from 'react';
import {SvgProps} from 'react-native-svg';

import {View, ViewProps} from './View';

type RestyleProps = LayoutProps<Theme> &
  BorderProps<Theme> &
  SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  PositionProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  layout,
  spacing,
  // border,
  backgroundColor,
  // position,
]);

type IconProps = RestyleProps & {
  source: React.FC<SvgProps>;
  svgProps?: SvgProps;
};

export const Icon: React.FC<IconProps> = ({source, svgProps, ...rest}) => {
  const props = useRestyle(restyleFunctions, rest as ViewProps);

  const SvgIcon = source;

  return (
    <View
      width={24}
      height={24}
      alignContent={'center'}
      justifyContent={'center'}
      alignItems={'center'}
      {...props}>
      <SvgIcon {...svgProps} />
    </View>
  );
};
