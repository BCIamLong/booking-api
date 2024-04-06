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
  createdAt: Date
  updatedAt: Date
}

export default interface IUser extends IUserInput, Document {
  _id: string
}
