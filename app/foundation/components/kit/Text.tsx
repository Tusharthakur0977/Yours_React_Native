import {Theme} from '@foundation/theme';
import {createText, TextProps} from '@shopify/restyle';
import React from 'react';
import {TextProps as RnTextProps} from 'react-native';

export const TextRestyle = createText<Theme>();

type Props = RnTextProps & TextProps<Theme>;

export const Text: React.FC<Props> = ({children, ...props}) => {
  return (
    <TextRestyle variant={'body1Sans'} {...props}>
      {children}
    </TextRestyle>
  );
};
