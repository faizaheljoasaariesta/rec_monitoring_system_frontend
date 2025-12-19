import type { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios-instance';
import type {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
} from '@/types/auth';

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response: AxiosResponse<{ data: RegisterResponse }> = await axiosInstance.post('/register', payload);
  return response.data.data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response: AxiosResponse<{ data: LoginResponse }> = await axiosInstance.post('/login', payload);
  return response.data.data;
};
