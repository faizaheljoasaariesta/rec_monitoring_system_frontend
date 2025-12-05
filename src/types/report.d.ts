export interface ProductResponse {
  status: string;
  code: number;
  message: string;
  data: {
    product: (string | null)[];
  };
}

export interface AnalyticResponse {
  status: string;
  code: number;
  message: string;
  data: {
    date: (string | null)[];
    analytic: (string | null)[];
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


