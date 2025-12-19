export interface ProductResponse {
  status: string;
  code: number;
  message: string;
  data: {
    product: {
      ProductNo: string;
      TravelCard: string;
      SerialNo: number;
      Operator: string;
      LastTestDatetime: string;
      Result: string;
    }[];
  };
}

export interface AnalyticResponse {
  status: string;
  code: number;
  message: string;
  data: {
    date: {
      startDate: string;
      endDate: string;
    };
    analytic: any[];
  }
}

export interface FocusAnalyticResponse {
  status: string;
  code: number;
  filters: {
    machineid: string | null;
    daysinterval: string | null;
  };
  message: string;
  data: Array<{
    date_value: string;
    NG_Count: number;
    OK_Count: number;
  }>
}

export interface ReportAIRDataResponse {
  status: string;
  code: number;
  count: number;
  message: string;
  data: {
    LOG_ID: number;
    TEST_WO: string;
    TEST_PN: string;
    TEST_SN: string;
    TEST_EMP: string;
    TEST_MACHINE: string;
    TEST_DATE: string;
    TEST_TIME: string;
    TEST_VALUE: string;
    TEST_BALANCE: string;
    TEST_MinVALUE: string;
    TEST_MaxVALUE: string;
    TEST_RESULT: string;
    STATION_IP: string;
  }[];
}

export interface ReportATDataResponse {
  status: string;
  code: number;
  count: number;
  message: string;
  data: {
    LOG_ID: number;
    TRAVEL_CARD_NUMBER: string;
    PRODUCT_NO: string;
    EMP_NO: string;
    LOG_FILENAME: string;
    SN: string;
    MC_NO: string;
    TEST_DATETIME: string;
    CERATE_DATATIME: string;
    BUILD_GRAPH: string;
    FOCUS_LENGTH_STATE: string;
    FOCUS_LENGTH: string;
  }[];
}

export interface ReportDCDataResponse {
  status: string;
  code: number;
  count: number;
  message: string;
  data: {
    DC_START_DATETIME: string;
    DC_END_DATETIME: string;
    DC_OPERATOR: string;
    DC_FIXTURE: string;
    DC_LOT_ID: string;
    DC_PB_ID: string;
    DC_CURRENT_COST: string;
    DC_TX_RX: string;
    DC_RX_VIDEO: string;
    DC_VIDEO_LOCK: string;
    EV1: string;
    EV2: string;
    EV3: string;
    EV4: number;
    EV5: number;
    EV6: number;
    EV7: number;
    DC_IMAGE: string;
    DC_RESULT: string;
    DC_SB_ID: string;
    DC_P2P_MACHINE: string;
    DC_P2P_OPERATOR: string;
    STATION_IP: string;
  }[];
}

export interface ReportLOCKDataResponse {
  status: string;
  code: number;
  count: number;
  message: string;
  data: {
    RunCardNumber: string;
    PN: string;
    Station: string;
    Operator: string;
    ProductSN: string;
    ProZ_File: string;
    ScrewIndex: string;
    FinalTorque: string;
    FinalTime: string;
    FinalTurns: string;
    FinalResult: string;
    FinishPosition: string;
    ErrorCode: string;
    TorqueUnit: string;
    ReWork: string;
    ProZ_LogFile: string;
    CreateDatetime: string;
    MechanicID: string;
  }[];
}

export interface MachineData {
  date: string;
  NGCount: number;
  OKCount: number;
  NGCountYear: number;
  OKCountYear: number,
  NGRate: number;
  NGYearRate: number;
}

export interface MachineDataAnalytic {
  machine: string;
  ok: number;
  ng: number;
  retry: number;
  okYear: number;
  ngYear: number;
  retryYear: number;
  rateRetry: number;
  rateRetryYear: number;
}

export interface ChartData {
  date: string
  rateOK: number
  rateNG: number
  rateRetry: number
}

export interface RawDailyData {
  test_date: string;
  total_ok: number;
  total_ng: number;
  total_retry: number;
}

