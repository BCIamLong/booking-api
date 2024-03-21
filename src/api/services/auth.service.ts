import { User } from '../database/models'
import { IUser } from '../interfaces'
import { AppError } from '../utils'

const loginService = async function (email: string, password: string) {
  const user = await User.findOne({ email })
  if (!user) throw new AppError(404, 'User is not exist')

  // @ts-ignore
  const checked = await user?.checkPwd(password, user.password)

  if (!checked) throw new AppError(400, 'Password is not correct!')

  return user
}

const signupService = async function (data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) {
  const newUser = await User.create(data)

  return newUser
}

export default { loginService, signupService }
