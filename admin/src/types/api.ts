export interface ApiErrorBody {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export interface ApiSuccessBody<T> {
  success: true
  data: T
}
