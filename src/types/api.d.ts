export interface ApiError {
  detail?: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[] | string;
}
// 添加嵌套body参数类型
export interface LoginCredentials {
  username: string;
  password: string;
  grant_type?: string;
}

export interface LoginRequest {
  body: LoginCredentials;
}