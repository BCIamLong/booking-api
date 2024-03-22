export default interface IGuest {
  _id: string
  fullName: string
  email: string
  password: string
  passwordConfirm?: string
  nationalId?: string
  nationality?: string
  countryFlag?: string
  passwordChangedAt?: Date
  passwordResetTokenTimeout?: Date
  role?: 'user'
  createdAt: Date
  updatedAt: Date
}
