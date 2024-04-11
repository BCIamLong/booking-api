import { Document } from 'mongoose'

export interface IGuestInput {
  fullName: string
  email: string
  password?: string
  passwordConfirm?: string
  verifyEmail?: boolean
  verifyEmailToken?: string
  nationalId?: string
  nationality?: string
  countryFlag?: string
  updatePasswordToken?: string
  passwordChangedAt?: Date
  passwordResetToken?: string
  passwordResetTokenTimeout?: Date
  deactivated?: boolean
  deactivatedReason?: string
  deleteAt?: Date
  deactivatedAt?: Date
  photo?: string
  role?: 'user'
  otp2FAAuthUrl?: string
  otp2FAToken?: string
  enable2FA?: boolean
  verify2FAOtp?: boolean
  createdAt: Date
  updatedAt: Date
}

export default interface IGuest extends IGuestInput, Document {
  _id: string
}
