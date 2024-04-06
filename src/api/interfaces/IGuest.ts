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
  photo?: string
  role?: 'user'
  createdAt: Date
  updatedAt: Date
}

export default interface IGuest extends IGuestInput, Document {
  _id: string
}
