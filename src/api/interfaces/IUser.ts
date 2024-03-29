export default interface IUser {
  _id: string
  name: string
  email: string
  password: string
  passwordConfirm: string
  role?: 'user' | 'admin'
  passwordChangedAt?: Date
  passwordResetTokenTimeout?: Date
  createdAt: Date
  updatedAt: Date
}
