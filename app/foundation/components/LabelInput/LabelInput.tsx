import React from 'react';
import {Theme} from '@foundation/theme';
import {useTheme} from '@shopify/restyle';
import {Input, InputProps, Text, View} from '../kit';
import {TextStyle} from 'react-native';
import fonts from 'foundation/assets/fonts';

interface LabeledInputProps extends InputProps {
  label: string;
  labelStyle?: TextStyle;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  labelStyle,
  ...inputProps
}) => {
  return (
    <View width={'100%'}>
      <Text
        marginBottom={'sp10'}
        color={'black'}
        fontFamily={fonts.OpensansBold}
        fontSize={16}>
        {label}
      </Text>
      <Input {...inputProps} />
    </View>
  );
};
