export default interface IGuest {
  _id: string
  fullName: string
  email: string
  password?: string
  passwordConfirm?: string
  verifyEmail?: boolean
  nationalId?: string
  nationality?: string
  countryFlag?: string
  passwordChangedAt?: Date
  passwordResetTokenTimeout?: Date
  photo?: string
  role?: 'user'
  createdAt: Date
  updatedAt: Date
}
