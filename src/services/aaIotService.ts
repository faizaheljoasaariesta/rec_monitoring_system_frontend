import axiosInstance from '@/services/axiosInstance'

export interface SummaryDailyResponse {
  success: boolean
  filters: {
    start: string
    end: string
    product: string
  }
  data: {
    test_date: string
    total_tests: number
    total_ok: number
    total_ng: number
    total_retry: number
  }[]
}

/**
 * Get AA-IoT daily summary data with start and end date
 */
export const getSummaryDaily = async (
  start: string,
  end: string
): Promise<SummaryDailyResponse> => {
  try {
    const response = await axiosInstance.get<SummaryDailyResponse>(
      `/aa-iot/summary/daily`,
      { params: { start, end } }
    )
    return response.data
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch AA-IoT daily summary')
  }
}
