import apiClient from './interceptors/apiClient';

export interface RequestPasswordResetRequest {
  email: string;
}

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Request a password reset email
 */
export const requestPasswordReset = async (
  email: string
): Promise<RequestPasswordResetResponse> => {
  const response = await apiClient.post<RequestPasswordResetResponse>(
    '/users/request-password-reset',
    { email }
  );
  return response.data;
};

/**
 * Reset password using token
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post<ResetPasswordResponse>('/users/reset-password', {
    token,
    new_password: newPassword
  });
  return response.data;
};
