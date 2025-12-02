import type { AxiosResponse } from 'axios';
import axiosInstance from '@/services/axiosInstance';
import type {
  ProductResponse,
  AnalyticResponse,
} from '@/types/report';

export type AnalyticMode = "machine" | "date"

export interface MonthlyAnalyticResponse {
  machines: any;
  days: any;
  status: string
  data: any
}

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

export const getProduct = async (): Promise<ProductResponse> => {
  const response: AxiosResponse<ProductResponse> = await axiosInstance.get('/aa-iot/product');
  return response.data;
}

export const getProductList = async (): Promise<ProductResponse> => {
  const response: AxiosResponse<ProductResponse> = await axiosInstance.get('/aa-iot/product-list');
  return response.data;
}

export const fetchSummary = async (
  start?: string, 
  end?: string,
  product?: string,
): Promise<SummaryResponse['summary']> => {
  try {
    const params: Record<string, string> = {}
    if (start) params.start = start
    if (end) params.end = end
    if (product) params.product = product

    const response: AxiosResponse<SummaryResponse> = await axiosInstance.get(
      "/aa-iot/summary",
      { params }
    );
    
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

export const getAnalytic = async (
  start?: string,
  end?: string,
): Promise<AnalyticResponse> => {
  const params: Record<string, string> = {}
  if (start) params.start = start
  if (end) params.end = end

  const response: AxiosResponse<AnalyticResponse> = await axiosInstance.get("/aa-iot/analytic", { params });
  return response.data;
}

export const getMonthlyAnalytic = async (
  start?: string,
  end?: string,
  mode: AnalyticMode = "machine"
): Promise<MonthlyAnalyticResponse> => {
  const params: Record<string, string> = {}

  if (start) params.start = start
  if (end) params.end = end
  params.mode = mode

  const response = await axiosInstance.get("/aa-iot/monthly-analytic", {
    params,
  })

  return response.data
}
