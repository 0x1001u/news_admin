export interface LoginCredentials {
  username: string; // 改为username
  password: string;
  remember?: boolean;
}
export interface Token {
  access_token: string;
  token_type: string;
}