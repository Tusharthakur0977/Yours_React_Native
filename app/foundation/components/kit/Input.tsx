import {Pressable, View} from '@foundation/components/kit/View';
import {Theme} from '@foundation/theme';
import {createBox, useTheme} from '@shopify/restyle';
// import fonts from 'foundation/assets/fonts';
import React, {PropsWithChildren, ReactNode, useRef, useState} from 'react';
import {
  TextInput as RNTextInput,
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Text} from './Text';
import {Icon} from './Icon';
import {Icons} from 'foundation/assets/icons';

export interface InputProps extends TextInputProps {
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  isRequired?: boolean;
  viewStartStyles?: ViewStyle;
  viewStart?: ReactNode;
  viewEndStyles?: ViewStyle;
  viewEnd?: ReactNode;
  autoCompleteType?: string;
  secureTextEntry?: boolean;
  startAdornment?: ReactNode;
  isClearable?: boolean;
  maxHeight?: number;
  minHeight?: number;
  onClearInput?: () => void;
  alignTextCenter?: boolean;
}
const TextInput = createBox<Theme, PropsWithChildren<TextInputProps>>(
  RNTextInput,
);

export const Input: React.FC<InputProps> = ({
  inputStyle,
  secureTextEntry = false,
  inputContainerStyle,
  value,
  defaultValue,
  viewEnd,
  viewEndStyles,
  viewStart,
  viewStartStyles,
  editable = true,
  multiline,
  startAdornment,
  isClearable = false,
  alignTextCenter = false,
  onPressOut,
  onChangeText,
  maxHeight,
  minHeight,
  onClearInput,
  ...rest
}: InputProps) => {
  const {colors} = useTheme<Theme>();
  const [hidden, setHidden] = useState(secureTextEntry);

  const inputRef = useRef<RNTextInput>();

  return (
    <View
      flexDirection={'row'}
      maxHeight={maxHeight}
      minHeight={minHeight}
      backgroundColor={'lightGreen'}
      borderRadius={5}
      borderWidth={0.3}
      borderColor={'green'}
      paddingVertical={'sp10'}
      paddingHorizontal={'sp12'}
      width={'100%'}
      style={inputContainerStyle}>
      {viewStart && (
        <View
          minHeight={44}
          justifyContent={'center'}
          alignItems={'center'}
          style={viewStartStyles}>
          {viewStart}
        </View>
      )}

      <View flex={1} flexDirection={'row'}>
        {startAdornment}
        <TextInput
          ref={inputRef}
          width={'100%'}
          flex={1}
          selectionColor={colors.black}
          value={value}
          secureTextEntry={hidden}
          padding={0} //require for android as that has extra-padding
          style={[
            styles.defaultInputStyle,
            inputStyle,
            {color: editable ? colors.black : colors.gray},
          ]}
          placeholderTextColor={colors.gray1}
          defaultValue={defaultValue}
          editable={editable}
          multiline={multiline}
          onPressOut={onPressOut}
          textAlign={alignTextCenter ? 'center' : 'left'}
          onChangeText={onChangeText}
          {...rest}
        />
      </View>
      {secureTextEntry && (
        <Pressable
          onPress={() => setHidden(!hidden)}
          position={'absolute'}
          right={10}
          top={'45%'}>
          {hidden ? (
            <Icon
              source={Icons.OpenEyeIcon}
              svgProps={{
                fill: colors.black,
                width: 15,
                height: 15,
              }}
            />
          ) : (
            <Icon
              source={Icons.SlashEyeIcon}
              svgProps={{
                fill: colors.black,
                width: 15,
                height: 15,
              }}
            />
          )}
        </Pressable>
      )}
      {viewEnd && (
        <View
          minHeight={48}
          justifyContent={'center'}
          alignItems={'center'}
          style={viewEndStyles}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  defaultInputStyle: {
    fontSize: 16,
    // fontFamily: fonts.LatoRegular,
  },
});
