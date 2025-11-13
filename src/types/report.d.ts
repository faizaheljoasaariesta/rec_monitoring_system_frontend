export interface ProductResponse {
  status: string;
  code: number;
  message: string;
  data: {
    product: (string | null)[];
  };
}