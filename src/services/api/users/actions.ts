import type { AxiosResponse } from 'axios';
import axiosInstance from '@/utils/axios-instance';

import type {
  GetAllUsersResponse,
  DeleteUserResponse,
  LogoutResponse,
} from '@/types/user';

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const response: AxiosResponse<GetAllUsersResponse> = await axiosInstance.get('/users');
  return response.data;
};

export const deleteUser = async (
  userId: string
): Promise<DeleteUserResponse> => {
  const response: AxiosResponse<DeleteUserResponse> = await axiosInstance.delete(`/delete/${userId}`);
  return response.data;
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token tidak ditemukan');

  const response: AxiosResponse<LogoutResponse> = await axiosInstance.post(
    "/logout", 
    {}, 
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};