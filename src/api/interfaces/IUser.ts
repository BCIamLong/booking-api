export default interface IUser {
  _id: string
  name: string
  email: string
  password: string
  passwordConfirm: string
  createdAt: Date
  updatedAt: Date
}
