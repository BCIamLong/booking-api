export default interface IGuest {
  _id: string
  fullName: string
  email: string
  password: string
  passwordConfirm?: string
  nationalId?: string
  nationality?: string
  countryFlag?: string
  createdAt: Date
  updatedAt: Date
}
