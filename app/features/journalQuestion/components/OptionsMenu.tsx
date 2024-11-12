import fonts from 'foundation/assets/fonts';
import {Pressable, Text} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import React, {Dispatch, FC, SetStateAction} from 'react';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';

type DayMenuProps = {
  isOptionMenu: boolean;
  setIsOptionMenu: Dispatch<SetStateAction<boolean>>;
  onPressExprotAsPdf: () => void;
};

const OptionsMenu: FC<DayMenuProps> = ({
  isOptionMenu,
  setIsOptionMenu,
  onPressExprotAsPdf,
}) => {
  return (
    <Menu
      style={{right:-30}}
      opened={isOptionMenu}
      onBackdropPress={() => setIsOptionMenu(false)}>
      <MenuTrigger />
      <MenuOptions
        optionsContainerStyle={{
          backgroundColor: '#f7e1e1',
          borderRadius: 5,
          width: 150,
        }}>
        <Pressable
          onPress={onPressExprotAsPdf}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}>
          <Text color={'black'} fontFamily={fonts.HelveticaRegular} fontSize={13}>
            Export to PDF
          </Text>
        </Pressable>
      </MenuOptions>
    </Menu>
  );
};

export default OptionsMenu;
