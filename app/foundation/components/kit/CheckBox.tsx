import { Icons } from '@foundation/assets/icons';
import { Theme } from '@foundation/theme';
import { useTheme } from '@shopify/restyle';
import React, { useEffect, useState } from 'react';

import { TouchableOpacity } from './Button';
import { Icon } from './Icon';
import { View } from './View';

interface CheckBoxProps {
  children?: React.ReactNode;
  value: boolean;
  onChange?: (val: boolean) => void;
  error?: string;
  disabled?: boolean;
  borderRadius?: number;
  width?: number;
  height? : number;
  iconWidth? : number;
  iconHeight?: number;
  marginRight?: boolean;

}

export const CheckBox = ({
  children,
  value = false,
  onChange,
  disabled,
  borderRadius = 4,
  width = 19,
  height = 19,
  iconWidth = 15,
  iconHeight = 15,
  marginRight = true,
}: CheckBoxProps) => {
  const [selected, setSelected] = useState<boolean>(value);
  const { colors } = useTheme<Theme>();

  useEffect(() => {
    if (value !== selected) {
      setSelected(value);
    }
  }, [selected, value]);

  const handleSelected = () => {
    onChange?.(!selected);
    setSelected(!selected);
  };
  return (
    <View>
      <TouchableOpacity disabled={disabled} onPress={handleSelected}>
        <View flexDirection={'row'}>
          <View
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius={borderRadius}
            width={width}
            height={height}
            borderWidth={2}
            borderColor={'green'}
            marginRight={marginRight ? 'sp12' : 'sp2'}
            backgroundColor={selected ? 'green' : 'transparent'}>
            {selected && (
              <Icon
                source={Icons.Check}
                svgProps={{fill: colors.white}}
                width={iconWidth}
                height={iconHeight}
              />
            )}
          </View>
          {children}
        </View>
      </TouchableOpacity>
    </View>
  );
};
