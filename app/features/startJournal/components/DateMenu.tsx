import React, {Dispatch, FC, SetStateAction} from 'react';
import {Menu, MenuOptions, MenuTrigger} from 'react-native-popup-menu';
import {Pressable, Text} from 'foundation/components/kit';
import {colors} from 'foundation/theme/colors';
import dayjs from 'dayjs';

type DayMenuProps = {
  isDateMenu: boolean;
  setIsDateMenu: Dispatch<SetStateAction<boolean>>;
  setDate: Dispatch<SetStateAction<any>>;
  setOpenDatePicker: Dispatch<SetStateAction<boolean>>;
};

const DateMenu: FC<DayMenuProps> = ({
  isDateMenu,
  setIsDateMenu,
  setDate,
  setOpenDatePicker,
}) => {
  const currentDate = dayjs();

  const today = dayjs().format('D MMMM YYYY');
  const yesterday = dayjs().subtract(1, 'day').format('D MMMM YYYY');
  const dayBeforeYesterday = dayjs().subtract(2, 'day').format('D MMMM YYYY');

  return (
    <Menu
      style={{left: 100, top: 10}}
      opened={isDateMenu}
      onBackdropPress={() => setIsDateMenu(false)}>
      <MenuTrigger />
      <MenuOptions
        optionsContainerStyle={{
          backgroundColor: '#f7e1e1',
          borderRadius: 5,
        }}>
        <Pressable
          onPress={() => {
            setDate(currentDate.toDate());
            setIsDateMenu(false);
          }}
          style={{
            borderBottomColor: colors.darkgray,
            paddingVertical: 5,
            borderBottomWidth: 0.4,
            paddingHorizontal: 15,
          }}>
          <Text color={'darkgray'} fontSize={12}>
            Today: {today}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setDate(currentDate.subtract(1, 'day').toDate());
            setIsDateMenu(false);
          }}
          style={{
            borderBottomColor: colors.darkgray,
            paddingVertical: 5,
            borderBottomWidth: 0.4,
            paddingHorizontal: 15,
          }}>
          <Text color={'darkgray'} fontSize={12}>
            Yesterday: {yesterday}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setDate(currentDate.subtract(2, 'day').toDate());
            setIsDateMenu(false);
          }}
          style={{
            borderBottomColor: colors.darkgray,
            paddingVertical: 5,
            borderBottomWidth: 0.4,
            paddingHorizontal: 15,
          }}>
          <Text color={'darkgray'} fontSize={12}>
            Day Before: {dayBeforeYesterday}
          </Text>
        </Pressable>
        <Pressable
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
          }}
          onPress={() => setOpenDatePicker(true)}>
          <Text color={'darkgray'} fontSize={12}>
            Pick any Date
          </Text>
        </Pressable>
      </MenuOptions>
    </Menu>
  );
};

export default DateMenu;
