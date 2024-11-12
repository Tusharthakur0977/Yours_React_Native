import NetInfo from '@react-native-community/netinfo';
import {toast, toastType} from 'foundation/hooks/toastService';
import {PermissionsAndroid} from 'react-native';
import Share from 'react-native-share';

export const isValidEmail = (email: string): boolean =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );

export const isStrongPassword = (password: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password,
  );

export async function checkInternetConnection() {
  let isConnected = false;
  try {
    let connectionState = await NetInfo.fetch();
    isConnected = connectionState.isConnected ?? false;
  } catch (e) {}
  if (!isConnected) {
    toast('No Internet Connection. Please try again.', toastType.ERROR_TOAST);
  }
  return isConnected;
}

export async function requestCameraPermission() {
  try {
    // Check if the camera permission is already granted
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (hasPermission) {
      console.log('Camera permission is already granted.');
      return true;
    }

    // Request camera permission if not already granted
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message:
          'This app needs access to your camera so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted.');
      return true;
    } else {
      console.log('Camera permission denied.');
      return false;
    }
  } catch (err) {
    console.warn('Camera permission request failed', err);
    return false;
  }
}

// convert date coming in this format 2014-03-14T00:00:00.000Z to this format April 1st, 2023
function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return 'th'; // handles special case for numbers between 4-20
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatDate(dateString: Date) {
  const date = new Date(dateString);

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${monthNames[monthIndex]} ${day}${getOrdinalSuffix(day)}, ${year}`;
}

export const daysOfWeek = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];
// function to get Date of previously occured day of week
export function getLastDay(dayName: string) {
  const today = new Date(); // Current date
  const todayDayOfWeek = today.getDay(); // Today's day of week index (0-6, Sunday-Saturday)
  const dayOfWeek = daysOfWeek.indexOf(dayName); // Convert dayName to index (0-6)

  // if (dayOfWeek === -1) {
  //   return null; // Invalid day name
  // }

  let daysToSubtract = todayDayOfWeek - dayOfWeek;
  if (daysToSubtract < 0) {
    // If today is before the day in the week
    daysToSubtract += 7;
  }

  const lastDayDate = new Date(today);
  lastDayDate.setDate(today.getDate() - daysToSubtract); // Calculate the last occurrence date

  return lastDayDate.toString();
}

export const getTimer = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formattedM = m < 10 ? '0' + m : m.toString();
  const formattedS = s < 10 ? '0' + s : s.toString();
  return `${formattedM}:${formattedS}`;
};

export const convertTo12Hour = (time24: string) => {
  const [hour24, minute] = time24.split(':').map(Number);
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
};

export const convertTimeStringToDate = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const now = new Date();
  now.setHours(hours);
  now.setMinutes(minutes);
  now.setSeconds(0);
  return now;
};

export const sharePDF = async (filePath: any) => {
  const shareOptions = {
    title: 'Share PDF',
    url: `file://${filePath}`, // Important: file URI needs to be prefixed with 'file://'
    type: 'application/pdf',
  };

  try {
    const shareResponse = await Share.open(shareOptions);
    console.log('Share Response:', shareResponse);
  } catch (error) {
    console.error('Error sharing PDF:', error);
  }
};
