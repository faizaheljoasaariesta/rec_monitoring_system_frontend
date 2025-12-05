import axiosInstance from '@/services/axiosInstance'

import type {
  FocusAnalyticResponse,
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