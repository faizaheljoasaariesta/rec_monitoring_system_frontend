import type { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios-instance';
import type {
  ProductResponse,
} from '@/types/report';

export const getProduct = async (): Promise<ProductResponse> => {
  const response: AxiosResponse<ProductResponse> = await axiosInstance.get('/aa-iot/product');
  return response.data;
}

export const getProductList = async (): Promise<ProductResponse> => {
  const response: AxiosResponse<ProductResponse> = await axiosInstance.get('/aa-iot/product-list');
  return response.data;
}
