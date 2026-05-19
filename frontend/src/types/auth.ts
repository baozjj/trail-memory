/** 当前登录用户（与后端 PublicUser 对齐） */
export interface AuthUser {
  id: string
  email: string
  nickname: string
  signature: string
  avatarUrl: string
  showCardOnGuestPage: boolean
  isVerified: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  nickname?: string
}

export interface UpdateProfilePayload {
  signature?: string
  avatarUrl?: string
  showCardOnGuestPage?: boolean
}

export interface AuthSession {
  token: string
  user: AuthUser
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiErrorBody {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}
