import axiosInstance from '@/utils/axios-instance'

import type {
  FocusAnalyticResponse,
  ReportLOCKDataResponse,
} from '@/types/report';

export const getASFocusAnalytic = async (
  daysinterval: string,
): Promise<FocusAnalyticResponse> => {
  try {
    const response = await axiosInstance.get<FocusAnalyticResponse>(
      "/lock-iot/focus-analytic",
      {
        params: { daysinterval },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fatching analytic data:", error);
    throw new Error(error.message || "Failed to fetch AS-IOT focus analytic report")
  }
}

export const getLOCKReportData = async (): Promise<ReportLOCKDataResponse> => {
  try {
    const response = await axiosInstance.get<ReportLOCKDataResponse>(
      `/lock-iot/data`
    )
    return response.data;
  } catch (error: any) {
    console.error("Error fetching report data:", error)
    throw new Error(error.message || "Failed to fetch LOCK-IoT report data")
  }
}