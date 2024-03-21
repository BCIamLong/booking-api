import { Guest, User } from '../database/models'
import { IGuest } from '../interfaces'
import { AppError } from '../utils'

const loginService = async function (email: string, password: string) {
  let user = await Guest.findOne({ email })

  if (!user) user = await User.findOne({ email })

  if (!user) throw new AppError(404, 'User is not exist')

  // @ts-ignore
  const checked = await user?.checkPwd(password, user.password)

  if (!checked) throw new AppError(400, 'Password is not correct!')

  return user
}

const signupService = async function (data: Omit<IGuest, '_id' | 'createdAt' | 'updatedAt'>) {
  const isExist = await User.findOne({ email: data.email })
  if (isExist) throw new AppError(409, 'This email is already exist')

  const newUser = await Guest.create(data)

  return newUser
}

const checkEmailExist = async function (role: 'user' | 'admin', email: string) {
  let isExist
  if (role === 'user') isExist = await Guest.findOne({ email })
  if (role === 'admin') isExist = await User.findOne({ email })
  // console.log(isExist)

  if (isExist) throw new AppError(409, 'This email is already exist')
}

export default { loginService, signupService, checkEmailExist }
