import {Theme} from '@foundation/theme';
import {SpacingProps} from '@shopify/restyle';
import React from 'react';

import {View} from './View';

type RestyleProps = SpacingProps<Theme>;

type SpaceProps = RestyleProps & {
  direction?: 'row' | 'column';
};
export const Space: React.FC<SpaceProps> = ({...rest}) => {
  return <View {...rest} />;
};
