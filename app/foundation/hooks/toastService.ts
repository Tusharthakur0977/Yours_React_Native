import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

/**
 * It shows a toast message.
 * @param {string} title - The title of the toast
 * @param {string} type - The type of toast to show. Can be 'success', 'warning', 'danger', 'info',
 * 'default'
 * @returns A function that takes two arguments, title and type, and returns a Toast.show() function.
 */
export const toast = (title: string, type: string, visibilityTime?: number) => {
  const defaultVisibilityTime = 4500;
  const actualVisibilityTime = visibilityTime ?? defaultVisibilityTime;
  return Toast.show({
    type: type,
    topOffset: Platform.OS === 'ios' ? 52 : 10,
    visibilityTime: actualVisibilityTime,
    text1: title,
  });
};

export const toastError = (title: string) => {
  toast(title, toastType.ERROR_TOAST);
};
/* An object that is used to store the type of toast to show. */
export const toastType = {
  SUCCESS_TOAST: 'successToast',
  ERROR_TOAST: 'errorToast',
};
