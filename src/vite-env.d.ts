/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@/services/auth' {
  export const registerUser: (data: { username: string; email: string; password: string }) => Promise<any>
  export const login: (credentials: { email: string; password: string }) => Promise<{ token: string }>
  export const getMe: () => Promise<any>
  export const updateMe: (data: { username?: string; email?: string; password?: string }) => Promise<any>
}