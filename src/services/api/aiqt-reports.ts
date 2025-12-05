import axiosInstance from '@/services/axiosInstance'

import type {
  ProductResponse,
  AnalyticResponse,
  FocusAnalyticResponse,
} from '@/types/report';

export type AnalyticMode = "machine" | "date"

export interface MonthlyAnalyticResponse {
  machines: any;
  days: any;
  status: string
  data: any
}

export interface SummaryDailyResponse {
  success: boolean
  filters: {
    start: string
    end: string
    product?: string
  }
  data: {
    test_date: string
    total_tests: number
    total_ok: number
    total_ng: number
    total_retry: number
  }[]
}

export interface ReportDataResponse {
  success: boolean
  count: number
  filters: {
    start: string
    end: string
    product?: string
  }
  data: {
    LOG_ID: number
    EMP_NO: string
    TRAVEL_CARD_NUMBER: string
    PRODUCT_NO: string
    LOG_FILENAME: string
    PROGRAM_NAME:string
    PROGRAM_VERSION: string
    TEST_DESC: string
    TEST_ITEM: string
    TEST_RESULT: string
    TEST_DATETIME: string
    TEST_CE0: string
    TEST_CE1: string
    TEST_UL0: string
    TEST_UL1: string
    TEST_UR0: string
    TEST_UR1: string
    TEST_BL0: string
    TEST_BL1: string
    TEST_BR0: string
    TEST_BR1: string
    TEST_L0: string
    TEST_L1: string
    TEST_R0: string
    TEST_R1: string
    TEST_Xf: string
    TEST_Yf: string
    TEST_Xi: string
    TEST_Yi: string
    TEST_FRr: string
    TEST_FRl: string
    TEST_FRb: string
    TEST_FRt: string
    CREATE_USERID: number
    CREATE_DATETIME: string
  }[]
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

export const getAIQTSummaryDaily = async (
  start: string,
  end: string,
  product?: string,
): Promise<SummaryDailyResponse> => {
  try {
    const response = await axiosInstance.get<SummaryDailyResponse>(
      `/aiqt-iot/summary/daily`,
      { params: { start, end, product } }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch AIQT-IoT daily summary')
  }
}

export const getAIQTReportData = async (
  start: string,
  end: string,
  product?: string
): Promise<ReportDataResponse> => {
  try {
    const response = await axiosInstance.get<ReportDataResponse>(
      `/aiqt-iot/filter`,
      { params: { start, end, product } }
    )
    return response.data
  } catch (error: any) {
    console.error("Error fetching report data:", error)
    throw new Error(error.message || "Failed to fetch AA-IoT report data")
  }
}

export const getAIQTSummary = async (
  start: string,
  end: string,
  product?: string,
): Promise<SummaryResponse['summary']> => {
  try {
    const response = await axiosInstance.get<SummaryResponse>(
      "/aiqt-iot/summary",
      {
        params: { start, end, product },
      }
    );

    return response.data.summary;
  } catch (error: any) {
    console.error("Error fetching summary data:", error);
    throw new Error(error.message || "Failed to fetch AA-IoT summary");
  }
};

export const getAIQTProduct = async (): Promise<ProductResponse> => {
  try {
    const response = await axiosInstance.get<ProductResponse>('/aiqt-iot/product')
    return response.data;
  } catch (error: any) {
    console.error("Error fatching product:", error)
    throw new Error(error.message || "Failed to fetch AIQT-IOT product");
  }
}

export const getAIQTAnalytic = async (
  start: string,
  end: string,
): Promise<AnalyticResponse> => {
  try {
    const response = await axiosInstance.get<AnalyticResponse>(
      "/aiqt-iot/analytic",
      {
        params: { start, end },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fatching analytic data:", error);
    throw new Error(error.message || "Failed to fetch BIQT-IOT analytic")
  }
}

export const getAIQTMonthlyAnalytic = async (
  start: string,
  end: string,
  mode: AnalyticMode = "machine"
): Promise<MonthlyAnalyticResponse> => {
  try {
    const response = await axiosInstance.get<MonthlyAnalyticResponse>(
      "/aiqt-iot/monthly-analytic",
      {
        params: { start, end, mode}
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Errorr fatching monthly analytic:", error);
    throw Error(error.message || "Failed to fetch AIQT-IOT monthly analytic")
  }
}

export const getAIQTFocusAnalytic = async (
  machineid: string,
  daysinterval: string,
): Promise<FocusAnalyticResponse> => {
  try {
    const response = await axiosInstance.get<FocusAnalyticResponse>(
      "/aiqt-iot/focus-analytic",
      {
        params: { machineid, daysinterval },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fatching analytic data:", error);
    throw new Error(error.message || "Failed to fetch AIQT-IOT focus analytic report")
  }
}
