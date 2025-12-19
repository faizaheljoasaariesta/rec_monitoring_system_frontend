export interface LogActivity {
  status: "online" | "offline";
  timeLogin: string | null;
  timeLogout: string | null;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
  LogActivity: LogActivity[];
}

export interface GetAllUsersResponse {
  status: string;
  code: number;
  message: string;
  data: User[];
}

export interface DeleteUserPayload {
  id: string;
}

export interface DeleteUserResponse {
  status: string;
  code: number;
  message: string;
}

export interface LogoutResponse {
  status: string;
  code: number;
  message: string;
}
