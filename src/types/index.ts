export * from './auth'; // 导出Token接口
export * from './news';
export * from './category';

// 认证相关类型
export interface AuthState {
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

export interface ApiResponse<T> {
  data: T;
  message: string;
  code: number;
}
export * from './dashboard';