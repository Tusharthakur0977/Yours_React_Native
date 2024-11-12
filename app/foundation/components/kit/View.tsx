import {Theme} from '@foundation/theme';
import {createBox} from '@shopify/restyle';
import React, {PropsWithChildren} from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
  ImageBackground as RNImageBackground,
  ImageBackgroundProps as RNImageBackgroundProps,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps as RNKeyboardAvoidingViewProps,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
  SafeAreaView as RNSafeAreaView,
  SectionList as RNSectionList,
  SectionListProps as RNSectionListProps,
  ViewProps as RNViewProps,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export const View = createBox<Theme>();
export type ViewProps = React.ComponentProps<typeof View>;

export const KeyboardAvoidingView = createBox<
  Theme,
  PropsWithChildren<RNKeyboardAvoidingViewProps>
>(RNKeyboardAvoidingView);
export type KeyboardAvoidingViewProps = React.ComponentProps<
  typeof KeyboardAvoidingView
>;

export const ScrollView = createBox<Theme, PropsWithChildren<ScrollViewProps>>(
  KeyboardAwareScrollView,
);

export type ScrollViewProps = React.ComponentProps<
  typeof KeyboardAwareScrollView
>;

export const SafeAreaView = createBox<Theme, PropsWithChildren<RNViewProps>>(
  RNSafeAreaView,
);

export const Pressable = createBox<Theme, PropsWithChildren<RNPressableProps>>(
  RNPressable,
);

export type SafeAreaViewProps = React.ComponentProps<typeof SafeAreaView>;

export const FlatList = createBox<
  Theme,
  PropsWithChildren<RNFlatListProps<any>>
>(RNFlatList);
export type FlatListProps = React.ComponentProps<typeof FlatList>;

export const SectionList = createBox<
  Theme,
  PropsWithChildren<RNSectionListProps<any>>
>(RNSectionList);
export type SectionListProps = React.ComponentProps<typeof SectionList>;

export const ImageBackground = createBox<
  Theme,
  PropsWithChildren<RNImageBackgroundProps>
>(RNImageBackground);
export type ImageBackgroundProps = React.ComponentProps<typeof ImageBackground>;
