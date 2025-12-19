export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  status: string;
  code: number;
  message: string;
  data: {
    email: string;
  };
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

