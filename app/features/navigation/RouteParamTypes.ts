import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParams = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  ResetPassword: undefined;
  WelcomeStack: undefined;
  Tabs: undefined;
  HomeStack: undefined;
  JournalStack: undefined;
  Library: undefined;
  ProfileStack: undefined;

  // Welcome Stack screen
  SetGoals: undefined;
  setNotification: undefined;

  // Home Stack Screens
  Home: undefined;
  WeeklyNotification?: {
    date: string;
    questions: string;
    type: string;
  };

  // Journal Stack screen
  Journal: undefined;
  JournalDay: undefined;
  JournalStart: {date: string};
  JournalQuestion: {
    date: string;
    isFromAddIcon?: boolean;
    type?: string;
    modalDate?: string;
    question?: string;
    placeholder?: string;
    isFromNotification?: boolean;
  };

  // Profile Stack Screen
  Resources: undefined;
  Profile?: {previousRoute?: string};
  ChangePassword: undefined;
  Notifications: undefined;
  Goals: undefined;
  Settings: undefined;
  EditDetails: undefined;
  TimerNotification?: {title: string};
};

export type BottomTabParams = {
  HomeStack: NavigatorScreenParams<HomeStackParams>;
  JournalStack: NavigatorScreenParams<JournalStackParams>;
  Library: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParams>;
};

export type HomeStackParams = {
  Home: undefined;
  WeeklyNotification?: {
    date: string;
    questions: string;
    type: string;
  };
};

export type ProfileStackParams = {
  Resources: undefined;
  Profile?: {previousRoute?: string};
  ChangePassword: undefined;
  Notifications: undefined;
  Goals: undefined;
  Settings: undefined;
  EditDetails: undefined;
  TimerNotification?: {title: string};
};

export type JournalStackParams = {
  Journal: undefined;
  JournalDay: undefined;
  JournalStart: {date: string};
  JournalQuestion: {
    date: string;
    isFromAddIcon?: boolean;
    type?: string;
    modalDate?: string;
    question?: string;
    placeholder?: string;
    isFromNotification?: boolean;
  };
};

export type WelcomeStackParams = {
  SetGoals: undefined;
  setNotification: undefined;
};
