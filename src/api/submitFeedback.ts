import apiClient from './interceptors/apiClient';
import { AxiosError } from 'axios';

export interface FeedbackResponse {
  text: string;
  user_id: string | null;
  visitor_id: string;
  created_at: string;
  updated_at: string;
}

export interface SubmitFeedbackRequest {
  text: string;
  visitor_id: string;
}

export const submitFeedback = async (
  text: string,
  visitorId: string
): Promise<FeedbackResponse> => {
  const body: SubmitFeedbackRequest = {
    text,
    visitor_id: visitorId
  };

  try {
    const resp = await apiClient.post<FeedbackResponse>(`/feedback/submit`, body);

    return resp.data;
  } catch (err: AxiosError | any) {
    console.log(`Submit feedback error: ${err.message}`);
    throw err;
  }
};
