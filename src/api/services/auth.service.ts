import crypto from 'crypto'
import bcrypt from 'bcrypt'
import axios from 'axios'
import qs from 'qs'
import { Guest, User } from '../database/models'
import { IGuest, IUser } from '../interfaces'
import { AppError } from '../utils'
import { oauthConfig } from '~/config'
import { Query } from 'mongoose'
import guestsService from './guests.service'
import { appConfig } from '~/config'
import redis from '../database/redis'
import { IGuestInput } from '../interfaces/IGuest'

const { redisClient, getCache, deleteCache } = redis
const { appEmitter, SERVER_ORIGIN, DELETE_ACCOUNT_TIMEOUT } = appConfig
const { findAndUpdateGuest, createGuest } = guestsService
const { OAUTH_GOOGLE_CLIENT_ID, OAUTH_GOOGLE_REDIRECT_URL, OAUTH_GOOGLE_SECRET } = oauthConfig

const loginService = async function (email: string, password: string) {
  let user: IUser | IGuest = (await Guest.findOne({ email }).cache({ type: 'session', key: 'user' })) as IGuest

  if (!user) user = (await User.findOne({ email }).cache({ type: 'session', key: 'user' })) as IUser

  if (!user) throw new AppError(404, 'User is not exist')

  // @ts-ignore
  const checked = await user.checkPwd(password, user.password)

  if (!checked) throw new AppError(400, 'Password is not correct!')

  return user
}

const signupService = async function (data: Omit<IGuestInput, 'createdAt' | 'updatedAt'>) {
  const user = await isUserExisted({ field: 'email', value: data.email })
  if (user) throw new AppError(409, 'This email is already exist')
  const token = crypto.randomBytes(64).toString('hex')
  const verifyEmailToken = crypto.createHash('sha256').update(token).digest('hex')

  //! in the create this keyword is refer to document no query object so that's why we can't use cache method because we custom it to query object of mongoose right
  // const query = Guest.create(data)
  // const newUser = await query

  // * so instead we need to use this findAndUpdateGuest to create our guest user
  data.verifyEmailToken = verifyEmailToken
  // ! BECAUSE THE FIRST TIME THE USER SIGNUP WE DON'T NEED TO CACHE THE USER DATA BECAUSE THEY ARE NOT VERIFY EMAIL RIGHT AND ONLY AFTER THEY VERIFY EMAIL WE JUST CACHE THE USER DATA
  // * THE CACHE PROCESS WILL HAPPEN IN THE VERIFY EMAIL ROUTE HANDLER

  const { data: newUser } = await createGuest(data)

  return newUser as IGuest
}

const checkEmailExist = async function (role: 'user' | 'admin', email: string) {
  let isExist
  if (role === 'user') isExist = await Guest.findOne({ email })
  if (role === 'admin') isExist = await User.findOne({ email })
  // console.log(isExist)

  if (isExist) throw new AppError(409, 'This email is already exist')
}

const isUserExisted = async function ({ field, value }: { field: string; value: string }) {
  const guest = await Guest.findOne({ [field]: value })
  let user
  if (guest) user = guest
  else user = await User.findOne({ [field]: value })
  // console.log(user)

  if (!user) return null
  return user
}

interface GoogleOauthTokens {
  access_token: string
  id_token: string
  expires_in: string
  refresh_token: string
  scope: string
}

const getGoogleOauthTokens = async function ({ code }: { code: string }): Promise<GoogleOauthTokens> {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: OAUTH_GOOGLE_CLIENT_ID,
    client_secret: OAUTH_GOOGLE_SECRET,
    redirect_uri: OAUTH_GOOGLE_REDIRECT_URL,
    grant_type: 'authorization_code'
  }
  const res = await axios.post<GoogleOauthTokens>(url, qs.stringify(values), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  return res.data
}

interface GoogleUser {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}

const getGoogleUser = async function ({
  id_token,
  access_token
}: {
  id_token: string
  access_token: string
}): Promise<GoogleUser> {
  const res = await axios.get<GoogleUser>(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    }
  )
  return res.data
}

const forgotPwdService = async function ({ email }: { email: string }) {
  const user = await isUserExisted({ field: 'email', value: email })
  if (!user) throw new AppError(400, "This user doesn't exist!")

  try {
    // const token = crypto.randomBytes(64).toString('hex')
    // const resetToken = crypto.createHash('sha256').update(token).digest('hex')
    // user.passwordResetToken = resetToken
    // user.passwordResetTokenTimeout = new Date(Date.now() + 3 * 60 * 60 * 1000)
    // * all four lines of code above are done by createResetPasswordToken of user or guest schema in the user or guest model file
    const token = await user.createResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const emailUrl = `${SERVER_ORIGIN}/api/v1/auth/reset-password/${token}/verify`

    appEmitter.resetPassword(user, emailUrl)
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetTokenTimeout = undefined
    await user.save({ validateBeforeSave: false })
    throw err
  }
}

const checkResetPwdTokenService = async function ({ token }: { token: string }) {
  const resetToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await isUserExisted({ field: 'passwordResetToken', value: resetToken })
  if (!user) throw new AppError(401, 'You reset password process is failed')

  if ((user.passwordResetTokenTimeout as Date) < new Date())
    throw new AppError(401, 'Your reset password turn is expired')

  return user
}

const resetPwdService = async function ({ token, password }: { password: string; token: string }) {
  const user = await checkResetPwdTokenService({ token })

  user.password = password
  user.passwordConfirm = password
  // * The code bellow will done in pre save hook guest model or user model
  // user.updatedAt = new Date()
  // user.passwordChangedAt = new Date()
  // user.passwordResetToken = undefined
  // user.passwordResetTokenTimeout = undefined

  await user.save()
}

const logoutService = async function () {
  // await redisClient.del('user')
  await deleteCache('user')
}

// const updateCurrentUserService = async function () {}

const checkCurrentPasswordService = async function ({
  // user,
  role,
  password
}: {
  // user: Omit<IUser, 'passwordConfirm'> | Omit<IGuest, 'passwordConfirm'>
  role: string
  password: string
}) {
  const user =
    role === 'admin'
      ? ((await getCache<IUser>({ key: 'user', model: User })) as IUser)
      : ((await getCache<IGuest>({ key: 'user', model: Guest })) as IGuest)
  // console.log(user)
  const check = await user.checkPwd(password, user.password!)
  if (!check) throw new AppError(400, 'Password is not correct')

  const token = await user.createToken()

  user.updatePasswordToken = token
  await user.save({ validateBeforeSave: false })

  return token
}

const updatePasswordService = async function ({ token, password }: { token: string; password: string }) {
  const user = await isUserExisted({ field: 'updatePasswordToken', value: token })
  if (!user) throw new AppError(401, 'Your update password process is failed')

  user.password = password
  user.passwordConfirm = password
  await user.save()

  return user
}

const deleteCurrentUserService = async function ({ reason, password }: { reason: string; password: string }) {
  const user = (await getCache<IGuest>({ key: 'user', model: Guest })) as IGuest
  // * maybe if the user does something to get access to delete account but doesn't have cache that means it might a invalid task, like user doesn't verify email but somehow the user can ignore that and access to our system
  // * then the cache doesn't have and we can throw the error like this
  if (!user) throw new AppError(401, 'Delete your account process is failed')

  const check = await user.checkPwd(password, user.password!)
  if (!check) throw new AppError(400, 'Your password is not corrected')

  user.deactivated = true
  user.deactivatedReason = reason
  user.deactivatedAt = new Date()
  user.deleteAt = new Date(Date.now() + DELETE_ACCOUNT_TIMEOUT * 1000)

  await user.save({ validateBeforeSave: false })
  // Guest.collection.createIndex({ deleteAt: 1 }, { expireAfterSeconds: DELETE_ACCOUNT_TIMEOUT })

  await deleteCache('user')
}

const restoreUserService = async function ({ email }: { email: string }) {}

const resetPwdServiceV0 = async function ({ token, password }: { token: string; password: string }) {
  const resetToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await isUserExisted({ field: 'passwordResetToken', value: resetToken })
  if (!user) throw new AppError(400, 'Bad request')

  if ((user.passwordResetTokenTimeout as Date) < new Date())
    throw new AppError(401, 'Your reset password turn is expired')

  user.password = password
  user.updatedAt = new Date()
  user.passwordChangedAt = new Date()
  user.passwordResetToken = undefined
  user.passwordResetTokenTimeout = undefined

  await user.save({ validateBeforeSave: false })
}

export default {
  loginService,
  signupService,
  checkEmailExist,
  getGoogleOauthTokens,
  getGoogleUser,
  resetPwdService,
  resetPwdServiceV0,
  forgotPwdService,
  checkResetPwdTokenService,
  logoutService,
  checkCurrentPasswordService,
  updatePasswordService,
  deleteCurrentUserService,
  restoreUserService
  // updateCurrentUserService
}
