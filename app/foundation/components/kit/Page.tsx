import {Theme} from '@foundation/theme';
import {SupportedColors} from '@foundation/theme/colors';
import {
  backgroundColor as bgColor,
  BackgroundColorProps,
  border,
  BorderProps,
  composeRestyleFunctions,
  LayoutProps,
  spacing,
  SpacingProps,
  useRestyle,
} from '@shopify/restyle';
import React, {forwardRef, useMemo} from 'react';
import {Platform} from 'react-native';

import {SafeAreaView, ScrollView, View, ViewProps} from './View';
import useKeyboardListeners from 'foundation/hooks/useKeyboardListeners';

type RestyleProps = LayoutProps<Theme> &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;

type PageProps = RestyleProps & {
  header?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  showsVerticalScrollIndicator?: boolean;
  safeAreaBackgroundColor?: SupportedColors;
  footerContainerProps?: ViewProps; //ignored if scrollable
};

const restyleFunctions = composeRestyleFunctions([spacing, border, bgColor]);

const CustomPage = (
  {
    header,
    children,
    footer,
    scrollable = true,
    safeAreaBackgroundColor = 'black',
    footerContainerProps,
    backgroundColor = 'gray2',
    showsVerticalScrollIndicator = true,
    ...rest
  }: PageProps,
  ref: React.Ref<any>,
) => {
  // @ts-ignore
  const props = useRestyle(restyleFunctions, rest as ViewProps);

  const isKeyboardVisible = useKeyboardListeners();


   const content = useMemo(
    () => (
      <View alignItems={'center'} {...props}>
        {children}
      </View>
    ),
    [children, props],
  );
  const bottomPadding = useMemo(() => {
    if (isKeyboardVisible) {
      if (Platform.OS === 'android') {
        return 280;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }, [isKeyboardVisible]);

  if (scrollable) {
    return (
      <View flex={1} backgroundColor={backgroundColor}>
        <SafeAreaView backgroundColor={safeAreaBackgroundColor} />
        {header && <>{header}</>}
        <ScrollView
          contentContainerStyle={{
            paddingBottom: bottomPadding,
          }}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          paddingBottom={'sp96'}
          keyboardOpeningTime={100}
          ref={ref}
          extraScrollHeight={30}>
          {content}
        </ScrollView>

        {footer && (
          <SafeAreaView backgroundColor={backgroundColor}>
            {footer}
          </SafeAreaView>
        )}
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor={backgroundColor}>
      <SafeAreaView backgroundColor={safeAreaBackgroundColor} />
      {header && <>{header}</>}
      <View flex={1}>{content}</View>
      {footer && (
        <SafeAreaView
          backgroundColor={backgroundColor}
          flex={0.15}
          {...footerContainerProps}>
          {footer}
        </SafeAreaView>
      )}
    </View>
  );
};

export const Page = forwardRef(CustomPage);
