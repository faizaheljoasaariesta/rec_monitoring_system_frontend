import type { AxiosResponse } from 'axios';
import axiosInstance from '@/services/axiosInstance';
import type {
  RegisterPayload,
  RegisterResponse,
  VerifyPayload,
  VerifyResponse,
  LoginPayload,
  LoginResponse,
} from '@/types/auth';

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const response: AxiosResponse<{ data: RegisterResponse }> = await axiosInstance.post('/register', payload);
  return response.data.data;
};

export const verify = async (payload: VerifyPayload): Promise<VerifyResponse> => {
  const response: AxiosResponse<{ data: VerifyResponse }> = await axiosInstance.post('/verify', payload);
  return response.data.data;
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response: AxiosResponse<{ data: LoginResponse }> = await axiosInstance.post('/login', payload);
  return response.data.data;
};
