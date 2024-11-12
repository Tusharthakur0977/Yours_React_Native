import {Theme} from '@foundation/theme';
import {
  BackgroundColorProps,
  LayoutProps,
  SpacingProps,
} from '@shopify/restyle';
import React from 'react';

import {View} from './View';

type RestyleProps = SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  LayoutProps<Theme>;

type DividerProps = RestyleProps & {
  direction?: 'row' | 'column';
};
export const Divider: React.FC<DividerProps> = ({
  direction = 'row',
  ...rest
}) => {
  return (
    <View
      alignSelf={'center'}
      backgroundColor={'gray2'}
      width={direction === 'row' ? '100%' : 1}
      height={direction === 'column' ? '100%' : 0.5}
      {...rest}
    />
  );
};
