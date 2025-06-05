export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface DashboardStats {
  userCount: number;
  newsCount: number;
  categoryCount: number;
  tagCount: number;
}

export interface Activity {
  id: number;
  action: string;
  target: string;
  timestamp: string;
  user: string;
}