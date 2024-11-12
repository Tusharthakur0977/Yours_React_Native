import env_constants from 'internals/env/env_constants.json';

const ENDPOINTS = {
  login: 'users/login',
  signup: 'users/signup',

  sendForgotPassowrdOtp: 'users/send-password-reset-otp',
  otpVerification: 'users/verify-password-reset-otp',
  resetPassword: 'users/reset-user-password',

  uploadProfileImage: 'imageupload',
  changePassword: 'users/change-user-password',
  getUserDetails: 'users/get-single-user-details',
  updateUserProfile: 'users/update-single-user-details',

  getUserGoalsList: 'users/get-single-user-goals-details',
  createUserGoals: 'users/create-single-user-goals-details',
  updateUserGoals: 'users/update-single-user-goals-details',

  getUserNotificationList: 'users/get-single-user-notification-details',
  createUserNotification:
    env_constants.API_BASE_URL +
    'users/create-single-user-notification-details',
  updateUserNotification:
    env_constants.API_BASE_URL +
    'users/update-single-user-notification-details',
  getQuestionList: 'users/view-single-user-journal-details',
  createQuestionList: 'users/create-single-user-journal-details',
  updateQuestionList: 'users/update-single-user-journal-details',
  deleteAccount: 'users/delete-single-user-details',
  searchLibrary:
    env_constants.API_BASE_URL +
    'users/view-single-user-library-journal-details',
  updateNotificationTime:
    env_constants.API_BASE_URL +
    'users/add-single-user-notification-preferred-timings',
  addSingleJournalNotificationDetail:
    env_constants.API_BASE_URL +
    'users/add-single-user-journal-notification-details',
};

export default ENDPOINTS;
