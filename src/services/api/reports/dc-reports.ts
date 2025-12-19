import axiosInstance from '@/utils/axios-instance'

import type {
  FocusAnalyticResponse,
  ReportDCDataResponse,
} from '@/types/report';


export const getDCFocusAnalytic = async (
  daysinterval: string,
): Promise<FocusAnalyticResponse> => {
  try {
    const response = await axiosInstance.get<FocusAnalyticResponse>(
      "/dc-iot/focus-analytic",
      {
        params: { daysinterval },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fatching analytic data:", error);
    throw new Error(error.message || "Failed to fetch DC-IOT focus analytic report")
  }
}

export const getDCReportData = async (): Promise<ReportDCDataResponse> => {
  try {
    const response = await axiosInstance.get<ReportDCDataResponse>(
      `/dc-iot/data`
    )
    return response.data
  } catch (error: any) {
    console.error("Error fetching report data:", error)
    throw new Error(error.message || "Failed to fetch DC-IoT report data")
  }
}