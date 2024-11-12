import {navigationRef} from 'features/navigation/handlers';
import {daysOfWeek, getLastDay} from 'foundation/utils/Helpers';

const foregrounfNotificationPress = (detail: any) => {
  const data = detail;
  const date = new Date(data?.date);
  const currentDay = date.getDay();
  const dayName = daysOfWeek[currentDay];

  if (data?.type === 'JOURNAL_REMINDER') {
    navigationRef.navigate('Tabs', {
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
    navigationRef.navigate('Tabs', {
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
    navigationRef.navigate('Tabs', {
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
    navigationRef.navigate('Tabs', {
      screen: 'ProfileStack',
      params: {
        screen: 'TimerNotification',
        params: {title: data?.timer_description},
      },
    });
  }
};

export default foregrounfNotificationPress;
