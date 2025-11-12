import type { AxiosResponse } from 'axios';
import axiosInstance from '@/services/axiosInstance';

export interface SummaryResponse {
  success: boolean;
  filters: Record<string, any>;
  summary: {
    total_tests: number;
    total_ok: number;
    total_ng: number;
    total_retry: number;
  };
}

export const fetchSummary = async (): Promise<SummaryResponse['summary']> => {
  try {
    const response: AxiosResponse<SummaryResponse> = await axiosInstance.get('/aa-iot/summary');
    if (response.data.success) {
      return response.data.summary;
    } else {
      throw new Error('Failed to fetch summary data');
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error fetching summary');
    } else {
      throw new Error('Error fetching summary');
    }
  }
};
