import axios from 'axios';
import {resetStack} from 'features/navigation/RootNavigation';
import {toast, toastType} from 'foundation/hooks/toastService';
import {storage} from 'foundation/storage';
import env_constants from 'internals/env/env_constants.json';
import {useMutation, useQuery} from 'react-query';
import ENDPOINTS from './ApiEndpoints';
import {
  AddSingleNotificationDetails,
  ChangePasswordAPiPayload,
  CreateUserGoalsAPiPayload,
  CreateUserNotificationAPiPayload,
  ForgotPasswordAPiPayload,
  GetUserDetailsApiPayload,
  LoginAPiPayload,
  OtpVerificationPayload,
  ResetPasswordAPiPayload,
  SaveAnwersAPiPayload,
  SignUpAPiPayload,
  UpdateeNotificationTime,
  UpdateUserDetailsAPiPayload,
} from './ApiInterfaces';

// Create an Axios instance
const Axios = axios.create({
  baseURL: env_constants.API_BASE_URL, // Base URL for all calls
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add a response interceptor
Axios.interceptors.response.use(
  response => response, // on success, just pass the response along
  error => {
    if (error.response && error.response.status === 401) {
      resetStack('Login', {});
      storage.reset();
      toast('Session Expired. Please Login again', toastType.ERROR_TOAST);
    }
    return Promise.reject(error); // re-throw error for further handling if needed
  },
);

export const useLoginApi = () => {
  return useMutation((payload: LoginAPiPayload) => {
    return Axios.post(ENDPOINTS.login, payload);
  });
};

export const useUploadProfileIMageApi = () => {
  return useMutation((payload: FormData) => {
    return Axios.post(ENDPOINTS.uploadProfileImage, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/file',
      },
    });
  });
};

export const useSignUpApi = () => {
  return useMutation((payload: SignUpAPiPayload) => {
    return Axios.post(ENDPOINTS.signup, payload);
  });
};

export const useForogtPasswordApi = () => {
  return useMutation((payload: ForgotPasswordAPiPayload) => {
    return Axios.post(ENDPOINTS.sendForgotPassowrdOtp, payload);
  });
};

export const useOtpVerificationApi = () => {
  return useMutation((payload: OtpVerificationPayload) => {
    return Axios.post(ENDPOINTS.otpVerification, payload);
  });
};

export const useResetPasswordApi = () => {
  return useMutation((payload: ResetPasswordAPiPayload) => {
    return Axios.post(ENDPOINTS.resetPassword, payload);
  });
};

export const useGetUserDetails = () => {
  return useMutation((payload: GetUserDetailsApiPayload) => {
    return Axios.post(ENDPOINTS.getUserDetails, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};
export const useUpdateUserProfile = () => {
  return useMutation((payload: UpdateUserDetailsAPiPayload) => {
    return Axios.put(ENDPOINTS.updateUserProfile, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};
export const useChangePasswordApi = () => {
  return useMutation((payload: ChangePasswordAPiPayload) => {
    return Axios.post(ENDPOINTS.changePassword, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};

export const useGetUserGoalsList = () => {
  return useQuery(ENDPOINTS.getUserGoalsList, () =>
    Axios.get(ENDPOINTS.getUserGoalsList, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    }),
  );
};
export const useCreateGoalsApi = () => {
  return useMutation((payload: CreateUserGoalsAPiPayload) => {
    return Axios.post(ENDPOINTS.createUserGoals, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};

export const useUpdateGoalsApi = () => {
  return useMutation((payload: CreateUserGoalsAPiPayload) => {
    return Axios.put(ENDPOINTS.updateUserGoals, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};

export const useGetUserNotificationList = () => {
  return useQuery(ENDPOINTS.getUserNotificationList, () =>
    Axios.get(ENDPOINTS.getUserNotificationList, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    }),
  );
};
export const useCreateNotificationApi = () => {
  return useMutation((payload: CreateUserNotificationAPiPayload) => {
    return Axios.post(ENDPOINTS.createUserNotification, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};
export const useUpdateNotificationApi = () => {
  return useMutation((payload: CreateUserNotificationAPiPayload) => {
    return Axios.put(ENDPOINTS.updateUserNotification, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};

export const useGetUserQuestionsList = (date: string) => {
  return useQuery(ENDPOINTS.getQuestionList, () =>
    Axios.get(`${ENDPOINTS.getQuestionList}?Journal_Date=${date}`, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    }),
  );
};

export const useSaveAnswerApi = () => {
  return useMutation((payload: SaveAnwersAPiPayload) => {
    return Axios.post(ENDPOINTS.createQuestionList, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};
export const useUpdateAnswerApi = () => {
  return useMutation((payload: SaveAnwersAPiPayload) => {
    return Axios.put(ENDPOINTS.updateQuestionList, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};

export const useDeleteAccount = () => {
  return useMutation(() => {
    return Axios.delete(ENDPOINTS.deleteAccount, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};

export const useSearchLibrary = (searchPhrase?: string) => {
  return useQuery(ENDPOINTS.searchLibrary, () =>
    Axios.get(
      searchPhrase && searchPhrase?.length > 0
        ? `${ENDPOINTS.searchLibrary}?searchPhrase=${searchPhrase}`
        : `${ENDPOINTS.searchLibrary}`,
      {
        headers: {
          Authorization: `Bearer ${storage.getToken()}`,
        },
      },
    ),
  );
};

export const useUpdatenotificationTimeApi = () => {
  return useMutation((payload: UpdateeNotificationTime) => {
    return Axios.post(ENDPOINTS.updateNotificationTime, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};
export const useAddSingleNotificationApi = () => {
  return useMutation((payload: AddSingleNotificationDetails) => {
    return Axios.post(ENDPOINTS.addSingleJournalNotificationDetail, payload, {
      headers: {
        Authorization: `Bearer ${storage.getToken()}`,
      },
    });
  });
};
