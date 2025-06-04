export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface DashboardStats {
  newsCount: number;
  userCount: number;
  commentCount: number;
  categoryCount: number;
}

export interface Activity {
  id: number;
  action: string;
  target: string;
  timestamp: string;
  user: string;
}