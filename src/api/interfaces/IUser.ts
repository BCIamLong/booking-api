import { Document } from 'mongoose'

export interface IUserInput {
  name: string
  email: string
  verifyEmail: boolean
  password: string
  passwordConfirm: string
  role?: 'user' | 'admin'
  updatePasswordToken?: string
  passwordChangedAt?: Date
  passwordResetToken?: string
  passwordResetTokenTimeout?: Date
  otp2FAAuthUrl?: string
  otp2FAToken?: string
  enable2FA?: boolean
  verify2FAOtp?: boolean
  createdAt: Date
  updatedAt: Date
}

export default interface IUser extends IUserInput, Document {
  _id: string
}
