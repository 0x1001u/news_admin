// 认证相关类型
export interface AuthState {
  token: string | null;
  userData: User | null;
}

// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  userList: User[];
  currentUser: User | null;
}