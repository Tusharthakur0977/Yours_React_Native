import {
  BoxProps,
  TextProps,
  ThemeProvider as ReThemeProvider,
} from '@shopify/restyle';
import * as React from 'react';

import {buttonTextVariants, buttonVariants} from './buttonsVariants';
import {colors} from './colors';
import {textVariants as textVariantsList} from './textVariants';

type BaseThemeType = typeof BaseTheme & {
  textVariants: {[key: string]: TextProps<typeof BaseTheme>};
  navigation: unknown;
  buttonVariants: {[key: string]: BoxProps<typeof BaseTheme>};
};

const createTheme = <T extends BaseThemeType>(themeObject: T): T => themeObject;

export const BaseTheme = {
  colors,
  spacing: {
    0: 0,
    sp1 :1,
    sp2: 2,
    sp4: 4,
    sp6: 6,
    sp8: 8,
    sp9: 9,
    sp10: 10,
    sp12: 12,
    sp15: 15,
    sp16: 16,
    sp20: 20,
    sp24: 24,
    sp28: 28,
    sp30 : 30,
    sp32: 32,
    sp36: 36,
    sp40: 40,
    sp48: 48,
    sp96: 96,
    sp120: 120,
    sp150: 150,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
};

export const theme = createTheme({
  ...BaseTheme,
  navigation: {
    dark: false,
    colors: {
      ...colors,
    },
  },
  buttonVariants: {
    // Adding just for autocomplete otherwise autocomplete for variant prop on Button doesn't work
    regular_primary: {},
    regular_primary_rounded: {},
    regular_outline: {},
    regular_cancel: {},
    regular_social: {},
    header_logout: {},
    regular_social_apple: {},
    menu_scan_qr: {},
    regular_outline_logout: {},
    regular_primary_delete: {},
    regular_outline_delete: {},
    regular_text_primary: {},
    regular_text: {},
    regular_text_full_width: {},
    ...buttonVariants,
  },
  textVariants: {
    ...buttonTextVariants,
    ...textVariantsList,
  },
});

export type Theme = typeof theme;

export const ThemeProvider = ({children}: {children: React.ReactNode}) => (
  <ReThemeProvider theme={theme}>{children}</ReThemeProvider>
);
