import axiosInstance from '@/utils/axios-instance'

import type {
  FocusAnalyticResponse,
  ReportAIRDataResponse,
} from '@/types/report';


export const getAIRFocusAnalytic = async (
  daysinterval: string,
): Promise<FocusAnalyticResponse> => {
  try {
    const response = await axiosInstance.get<FocusAnalyticResponse>(
      "/air-iot/focus-analytic",
      {
        params: { daysinterval },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fatching analytic data:", error);
    throw new Error(error.message || "Failed to fetch AIR-IOT focus analytic report")
  }
}

export const getAIRReportData = async (): Promise<ReportAIRDataResponse> => {
  try {
    const response = await axiosInstance.get<ReportAIRDataResponse>(
      `/air-iot/data`
    )
    return response.data;
  } catch (error: any) {
    console.error("Error fetching report data:", error)
    throw new Error(error.message || "Failed to fetch AIR-IoT report data")
  }
}