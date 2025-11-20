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