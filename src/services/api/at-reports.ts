import axiosInstance from '@/services/axiosInstance'

import type {
  FocusAnalyticResponse,
} from '@/types/report';


export const getATFocusAnalytic = async (
  machineid: string,
  daysinterval: string,
): Promise<FocusAnalyticResponse> => {
  try {
    const response = await axiosInstance.get<FocusAnalyticResponse>(
      "/at-iot/focus-analytic",
      {
        params: { machineid, daysinterval },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fatching analytic data:", error);
    throw new Error(error.message || "Failed to fetch AT-IOT focus analytic report")
  }
}