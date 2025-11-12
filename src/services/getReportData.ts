import axiosInstance from "@/services/axiosInstance"

export interface ReportDataResponse {
  success: boolean
  count: number
  filters: {
    start: string
    end: string
    product: string
  }
  data: {
    LOG_ID: number
    EMP_NO: string
    PRODUCT_NO: string
    LOG_FILENAME: string
    TEST_ITEM: string
    TEST_RESULT: string
    CREATE_DATETIME: string
    TEST_DATETIME: string
  }[]
}

/**
 * Get AA-IoT filtered report data
 * Example: /aa-iot/filter?start=2025-10-01&end=2025-10-31
 */
export const getReportData = async (
  start: string,
  end: string
): Promise<ReportDataResponse> => {
  try {
    const response = await axiosInstance.get<ReportDataResponse>(
      `/aa-iot/filter`,
      { params: { start, end } }
    )
    return response.data
  } catch (error: any) {
    console.error("Error fetching report data:", error)
    throw new Error(error.message || "Failed to fetch AA-IoT report data")
  }
}
