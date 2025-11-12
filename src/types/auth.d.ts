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

export interface VerifyPayload {
  email: string;
  code: string;
}

export interface VerifyResponse {
  status: string;
  code: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    createdAt: string;
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

