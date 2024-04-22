export interface UserSession {
  _id: string
  name: string
  role: 'user' | 'admin'
  enable2FA: boolean
  verify2FAOtp?: boolean
}

export interface UpdateCurrentUserInput {
  name?: string
  fullName?: string
  email?: string
  avatar?: File
}
