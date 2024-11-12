import {EventType} from '@notifee/react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParams} from 'features/navigation/RouteParamTypes';
import {daysOfWeek, getLastDay} from 'foundation/utils/Helpers';

const handleNotificationPress = (
  {
    type,
    detail,
  }: {
    type: EventType;
    detail: any;
  },
  navigation?: StackNavigationProp<RootStackParams>,
) => {
  const data = detail.notification;
  const date = new Date(data?.date);
  const currentDay = date.getDay();
  const dayName = daysOfWeek[currentDay];

  if (type === EventType.PRESS) {
    if (data?.type === 'JOURNAL_REMINDER') {
      navigation!.replace('Tabs', {
        screen: 'JournalStack',
        params: {
          screen: 'JournalQuestion',
          params: {
            date: getLastDay(dayName),
            isFromAddIcon: true,
            isFromNotification: false,
          },
        },
      });
    } else if (
      data?.type === 'Question_prompt_morning' ||
      data?.type === 'Question_prompt_night'
    ) {
      navigation!.replace('Tabs', {
        screen: 'JournalStack',
        params: {
          screen: 'JournalQuestion',
          params: {
            date: getLastDay(dayName),
            type: data?.type,
            modalDate: data?.date,
            question: data.Question,
            placeholder: data?.placeHolder,
            isFromAddIcon: false,
            isFromNotification: true,
          },
        },
      });
    } else if (data?.type === 'WEEKLY_INTENTION') {
      navigation!.replace('Tabs', {
        screen: 'HomeStack',
        params: {
          screen: 'WeeklyNotification',
          params: {
            type: data?.type,
            date: data?.date,
            questions: data?.journalNotificationArray,
          },
        },
      });
    } else {
      navigation!.replace('Tabs', {
        screen: 'ProfileStack',
        params: {
          screen: 'TimerNotification',
          params: {title: data?.timer_description},
        },
      });
    }
  }
};

export default handleNotificationPress;
