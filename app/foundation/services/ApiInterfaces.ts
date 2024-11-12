export interface LoginAPiPayload {
  email: string;
  password: string;
  fcmToken: string;
}

export interface SignUpAPiPayload {
  fullName: string;
  email: string;
  password: string;
  profileImage: string;
  DOB: string;
  fcmToken: string;
  timezone?: string;
  user_submitted_qa?: any;
}

export interface ForgotPasswordAPiPayload {
  email: string;
}

export interface OtpVerificationPayload {
  verification_key: string;
  otp: string;
  check: string;
}

export interface ResetPasswordAPiPayload {
  email: string;
  newPassword: string;
}
export interface GetUserDetailsApiPayload {
  currentDate: string;
}

export interface UpdateUserDetailsAPiPayload {
  fullName?: string;
  profileImage?: string;
  DOB?: string;
  timezone?: string;
  user_submitted_qa?: any;
  fcmToken?: string[] | string;
}

export interface ChangePasswordAPiPayload {
  oldPassword: string;
  newPassword: string;
}

export interface CreateUserGoalsAPiPayload {
  goals_choosen: number[];
  other_goals_text?: string;
}

export interface CreateUserNotificationAPiPayload {
  notification_choosen: number[];
  timezone?: string;
}

export interface SaveAnwersAPiPayload {
  Journal_Date: string;
  user_submitted_response: {
    id: string;
    user_answer: string | number[];
    user_rating?: number;
  };
}

export interface UpdateeNotificationTime {
  user_preferred_notification_timings: [
    {
      notificationId: number;
      preferredTime: string;
    },
  ];
  timezone?: string;
}

export interface AddSingleNotificationDetails {
  Journal_Date: string;
  user_submitted_response: {
    id: string;
    user_answer: string | number[];
  };
  notification_type: string;
  other_journaling_notification_text?: string;
}
