import {BoxProps, TextProps} from '@shopify/restyle';

import {BaseTheme} from './index';
import fonts from 'foundation/assets/fonts';

type buttonsVariantsProp = {[key: string]: BoxProps<typeof BaseTheme>};
type textButtonsVariantsProp = {[key: string]: TextProps<typeof BaseTheme>};

export const buttonVariants: buttonsVariantsProp = {
  defaults: {},
  primary: {
    flex: 1,
    backgroundColor: 'primary',
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 'sp24',
  },
  secondary: {
    flex: 1,
    borderColor: 'primary',
    borderWidth: 2,
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 'sp24',
  },
  regular_social: {
    flex: 1,
    backgroundColor: 'social',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 'sp20',
  },
  regular_social_apple: {
    flex: 1,
    backgroundColor: 'white',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 'sp20',
  },
  regular_text_primary: {
    flex: 1,
    backgroundColor: 'transparent',
    minHeight: 40,
    paddingHorizontal: 'sp24',
  },
  regular_text: {
    flex: 0,
    backgroundColor: 'transparent',
    minHeight: 40,
    paddingHorizontal: 'sp24',
  },
  regular_outline: {
    flex: 1,
    borderColor: 'primary',
    borderWidth: 2,
    minHeight: 48,
    borderRadius: 4,
    paddingHorizontal: 'sp24',
  },
  regular_outline_logout: {
    flex: 1,
    borderColor: 'red',
    borderWidth: 2,
    minHeight: 48,
    borderRadius: 4,
    paddingHorizontal: 'sp24',
  },
  regular_primary: {
    flex: 1,
    backgroundColor: 'green',
    borderRadius: 15,
    paddingHorizontal: 'sp20',
    paddingVertical: 'sp15',
  },
  header_logout: {
    borderRadius: 40,
    paddingHorizontal: 'sp15',
    backgroundColor: 'primary',
    paddingVertical: 'sp6',
  },
  insurance_get_started: {
    borderRadius: 40,
    paddingHorizontal: 'sp15',
    backgroundColor: 'white',
    paddingVertical: 'sp6',
  },
  emergency_get_started: {
    borderRadius: 40,
    paddingHorizontal: 'sp15',
    backgroundColor: 'white',
    paddingVertical: 'sp6',
  },
  shop_now: {
    borderRadius: 40,
    paddingHorizontal: 'sp15',
    backgroundColor: 'white',
    paddingVertical: 'sp6',
  },
  menu_scan_qr: {
    borderRadius: 40,
    paddingHorizontal: 'sp15',
    backgroundColor: 'transparent',
    paddingTop: 'sp6',
    paddingBottom: 'sp8',
    borderColor: 'white',
    borderWidth: 1,
  },
};

export const buttonTextVariants: textButtonsVariantsProp = {
  button_primary: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.HelveticaRegular,
  },
  button_regular_social: {
    color: 'white',
    fontSize: 18,
    // fontFamily: fonts.LatoBold,
  },
  button_regular_social_apple: {
    color: 'black',
    fontSize: 18,
    // fontFamily: fonts.LatoBold,
  },
  button_secondary: {
    color: 'primary',
    fontSize: 16,
    lineHeight: 22,
    // fontFamily: fonts.LatoRegular,
  },
  button_regular_text_primary: {
    color: 'primary',
    fontSize: 16,
    lineHeight: 22,
    // fontFamily: fonts.LatoRegular,
  },
  button_regular_outline: {
    color: 'primary',
    fontSize: 16,
    lineHeight: 22,
    // fontFamily: fonts.LatoRegular,
  },
  button_regular_outline_logout: {
    color: 'red',
    fontSize: 16,
    lineHeight: 22,
    // fontFamily: fonts.LatoRegular,
  },
  button_regular_primary: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.HelveticaRegular,
  },
  button_header_logout: {
    color: 'white',
    fontSize: 11,
    // fontFamily: fonts.LatoBold,
  },
  button_insurance_get_started: {
    fontSize: 10,
    color: 'purpleText',
    // fontFamily: fonts.LatoBold,
  },
  button_shop_now: {
    fontSize: 10,
    color: 'red',
    // fontFamily: fonts.LatoBlack,
  },
  button_menu_scan_qr: {
    fontSize: 10,
    // fontFamily: fonts.LatoBold,
    color: 'white',
  },
};

export type ButtonVariant = keyof typeof buttonVariants;
