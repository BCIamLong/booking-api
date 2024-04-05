import jwt from 'jsonwebtoken'
import sharp from 'sharp'
import { Request, Response } from 'express'
import { authService, guestsService, usersService } from '../services'
import { jwtConfig, appConfig } from '~/config'
import { IGuest, IUser } from '../interfaces'
import { AppError, Email } from '../utils'
import { JwtPayload } from 'jsonwebtoken'
import redis from '../database/redis'
// import { Document } from 'mongoose'

const { redisClient } = redis
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = jwtConfig
const { CLIENT_ORIGIN, appEmitter } = appConfig
const {
  loginService,
  signupService,
  logoutService,
  getGoogleOauthTokens,
  getGoogleUser,
  forgotPwdService,
  resetPwdService,
  resetPwdServiceV0,
  checkResetPwdTokenService
} = authService
const { findAndUpdateGuest, editGuest } = guestsService
const { editUser } = usersService

// interface IUserDocument extends Document {
//   _id: string
//   name: string
//   email: string
//   password: string
//   passwordConfirm: string
//   role?: 'user' | 'admin'
//   passwordChangedAt?: Date
//   passwordResetTokenTimeout?: Date
//   createdAt: Date
//   updatedAt: Date
// }

// interface IGuestDocument extends Document {
//   _id: string
//   fullName: string
//   email: string
//   password?: string
//   passwordConfirm?: string
//   nationalId?: string
//   nationality?: string
//   countryFlag?: string
//   passwordChangedAt?: Date
//   passwordResetTokenTimeout?: Date
//   photo?: string
//   role?: 'user'
//   createdAt: Date
//   updatedAt: Date
// }

const signToken = function (type: 'access' | 'refresh', user: IUser | IGuest) {
  const secret = type === 'access' ? ACCESS_TOKEN_SECRET! : REFRESH_TOKEN_SECRET!
  return jwt.sign({ id: user?._id }, secret, {
    expiresIn: type === 'access' ? ACCESS_TOKEN_EXPIRES : REFRESH_TOKEN_EXPIRES
  })
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}

const setCookies = function (res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access-token', accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + Number(ACCESS_TOKEN_EXPIRES!))
  })
  res.cookie('refresh-token', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + Number(REFRESH_TOKEN_EXPIRES!))
  })
}

const login = async function (req: Request, res: Response) {
  const { email, password } = req.body
  const user = await loginService(email, password)

  // * generate access token and refresh token
  const accessToken = signToken('access', user)
  const refreshToken = signToken('refresh', user)
  // * store user data to session or something like that (protected middleware will do this task)
  // * send back access token if we have no error
  setCookies(res, accessToken, refreshToken)

  res.json({
    status: 'success',
    token: accessToken
  })
}

const signup = async function (req: Request, res: Response) {
  const { fullName, email, password, passwordConfirm } = req.body
  const newUser = await signupService({ fullName, email, password, passwordConfirm })
  // * hash password and remove password confirm (done in user model)
  // * generate access token and refresh token
  const accessToken = signToken('access', newUser as IUser | IGuest)
  const refreshToken = signToken('refresh', newUser as IUser | IGuest)
  // * store user data to session or something like that (protected middleware will do this task)
  // * send back access token if we have no error

  setCookies(res, accessToken, refreshToken)
  res.json({
    status: 'success',
    token: accessToken
  })

  // *send welcome email (use the approach from guest model) so add more business logic as possible to business layers
  // const url = `${req.protocol}://${req.get('host')}/api/v1/users/verify-email` //* redirect back to homepage
  // appEmitter.signup(newUser as IGuest, url)
  // appEmitter.signup(newUser as IGuest, CLIENT_ORIGIN)
  // const url = CLIENT_ORIGIN //* redirect back to homepage
  // const emailHost = new Email(newUser as IGuest, url)
  // emailHost.sendWelcomeMail()
}

// * so this controller handler will handle for this endpoint: /api/session/oauth/google when the user click to login account of google
const loginWithGoogle = async function (req: Request, res: Response) {
  // *1, get the code from request query string (google will redirect with the url with many queries on that query string, that link to do something but we can get the code to get the tokens)
  const code = req.query.code as string
  // *2, get tokens based on the code (get id_token and access_token): create the service function for this

  const { id_token, access_token } = await getGoogleOauthTokens({ code })
  // *3, get user from this id_token by decode this id_token / get user by send back the request to google providers to get the entire user (full infos)
  // WAY 1: get user from this id_token by decode this id_token
  // const user = jwt.decode(id_token)
  // console.log(user)
  // === {
  //   iss: 'https://accounts.google.com',
  //   azp: '291632962191-ajj14pb6gqpr9a9q0rmf9c2sqb9bk9kd.apps.googleusercontent.com',
  //   aud: '291632962191-ajj14pb6gqpr9a9q0rmf9c2sqb9bk9kd.apps.googleusercontent.com',
  //   sub: '109762013601184439097',
  //   email: 'hoalanh21112002@gmail.com',
  //   email_verified: true,
  //   at_hash: 'szxzpj2Q4BDLfsWGNRh5YA',
  //   name: 'Lanh Hoa',
  //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocLijas_GUu8bhMMYxjmOHiQUQIKnk66oYxxZTbbBwQW=s96-c',
  //   given_name: 'Lanh',
  //   family_name: 'Hoa',
  //   iat: 1711366592,
  //   exp: 1711370192
  // }

  // WAY 2: get user by send back the request to google providers to get the entire user (full infos)
  const user = await getGoogleUser({ id_token, access_token })
  // console.log(user)
  // ==={
  //   id: '109762013601184439097',
  //   email: 'hoalanh21112002@gmail.com',
  //   verified_email: true,
  //   name: 'Lanh Hoa',
  //   given_name: 'Lanh',
  //   family_name: 'Hoa',
  //   picture: 'https://lh3.googleusercontent.com/a/ACg8ocLijas_GUu8bhMMYxjmOHiQUQIKnk66oYxxZTbbBwQW=s96-c',
  //   locale: 'en'
  // }
  // ? we can choose whatever way we want if we need this so it's depend our application requirements

  // *4, upsert user (check user if user exist then just keep it otherwise create new user) we will create the findAndUpdateUser function to do this task
  const { email, name: fullName } = user

  // * so we need to check that user google account, because we don't allow the user has no verify access to our app, and we also trusted that google has done this process correctly
  if (!user.verified_email)
    throw new AppError(403, 'Google account is not verified, please verify your google account to continue!')

  const newUser = await findAndUpdateGuest(
    { email, verifyEmail: true },
    {
      email,
      fullName
    },
    {
      upsert: true,
      new: true
    }
  )!

  // *5, create session/ save to req/ save to memory server like redis
  req.user = newUser!

  // *6, create the access and refresh token
  const accessToken = signToken('access', newUser!)
  const refreshToken = signToken('refresh', newUser!)

  // *7, create the cookie for access and refresh token
  setCookies(res, accessToken, refreshToken)

  // *8, redirect to our client
  res.redirect(CLIENT_ORIGIN!)
  // ! keep in mind that we can use the package like google apis(https://www.npmjs.com/package/googleapis) and it will have many built-in functions for us to use so like this controller function it also have
  // ! but with this we can understand how all of these work behind the scenes right, but later if we want we can just use the library if we really work with oauth many times
}

const verifyEmail = async function (req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies['access-token'] || req.cookies['refresh-token']
  let userSession
  let decoded
  if (token)
    decoded = (
      req.cookies['access-token'] ? jwt.verify(token, ACCESS_TOKEN_SECRET) : jwt.verify(token, REFRESH_TOKEN_SECRET)
    ) as JwtPayload
  else userSession = await redisClient.get('user')

  if (!token && !userSession) throw new AppError(401, 'Verify email process is failed!')

  // console.log(decoded, userSession)

  const { data } = await editGuest(decoded?.id || JSON.parse(userSession!)._id, { verifyEmail: true })
  if (!data) throw new AppError(404, 'Verify email process is failed!')

  res.redirect(CLIENT_ORIGIN)
}

const forgotPassword = async function (req: Request, res: Response) {
  // * user perform the forgot password feature
  // * they go to the form and enter email
  const { email } = req.body
  // * check this email correct format(schema will do that), exist? if false throw error (1)
  // * create reset token then send the reset email which the link include this token (2)
  // * set reset token timeout, store the reset token to compare later on in rest password (3)
  // * if the process has error make sure reset everything like reset token and its timeout cuz we don't want store it to DB when this process fails right (4)
  // ? (1), (2), (3), (4) are already done in the forgot password service
  await forgotPwdService({ email })

  // * if success return some response with message allow user know that we sent the reset password email

  res.json({
    status: 'success',
    message: 'Sent the mail to your email, please check that and reset your password'
  })
}

const checkResetPasswordToken = async function (req: Request, res: Response) {
  // * user click to the link from email
  // * get the token from the url
  const token = req.params.token
  // * convert this token to reset token (1)
  // * then query to the user or guest to find the user send this token if we have no users for this token then  just throw error (2)
  // * if we find user send this token then check the timeout is over 3 minutes or not? if it's over just throw error of token expires (3)
  // ? (1), (2), (3) done by checkResetPwdTokenService
  const user = await checkResetPwdTokenService({ token })

  // req.user = user
  req.token = token

  res.redirect(`${CLIENT_ORIGIN}/reset-password`)
}

const resetPassword = async function (req: Request, res: Response) {
  // * user click to the link from email
  // * get the token from the url
  const { token } = req.params
  // console.log(token)
  const { password } = req.body
  // * convert this token to reset token (1)
  // * then query to the user or guest to find the user send this token if we have no users for this token then  just throw error (2)
  // * if we find user send this token then check the timeout is over 3 minutes or not? if it's over just throw error of token expires (3)
  // * if token timeout valid allow user enter password and password confirm, check identical or not, if not just throw error (done by schema which will validate data(req.body))
  // * if identical just update new password remove the password confirm, reset token, token timeout because we don't want save these to our DB, update password changed at date and also the updated at date (4)
  // ?  (4) done by resetPwdService
  await resetPwdService({ token, password })
  // * then after success we can redirect the user to the login page to user can login with new password

  // res.redirect(`${CLIENT_ORIGIN}/login`)

  res.json({
    status: 'success',
    token
  })
}

const logout = async function (req: Request, res: Response) {
  await logoutService()
  res.clearCookie('access-token')
  res.clearCookie('refresh-token')

  res.json({
    status: 'success',
    message: 'Logout successfully'
  })
}

// * because we have validator with Joi then we don't need to it to validate our req body
const filterObject = function (body: any, ...fields: string[]) {
  const newBody: any = {}
  fields.forEach((field: string) => body[field] && (newBody[field] = body[field]))

  return newBody
}

const updateCurrentUser = async function (req: Request, res: Response) {
  // * user logged in, and go to the user profile page
  // * user click to the edit form then fill new data for like name, email (normal data, credential data) and don't allow user updates password
  // * user also can change the avatar (image data related to file)
  // * check if user change normal? credential? file? data
  // * if it's normal data and credential data we just update normal
  // * if it's file data we need to store this image in our app, or upload it to the hosting image platform like cloudinary
  // * to do that we need to create the file name then use this file name for the file we stored and also store this file name to our DB, we do not store the entire file to our DB
  // * then if the process success we just return the response with some message
  if (req.file) req.body.avatar = req.fileName

  let updatedUser
  if (req.user.role === 'admin') updatedUser = await editUser(req.user._id, req.body, false)
  if (req.user.role === 'user') updatedUser = await editGuest(req.user._id, req.body, false)

  res.json({
    status: 'success',
    data: {
      user: updatedUser?.data
    }
  })
}

const resetPasswordV0 = async function (req: Request, res: Response) {
  // * user click to the link from email
  // * get the token from the url
  const token = req.params.token
  const { password } = req.body
  // * convert this token to reset token (1)
  // * then query to the user or guest to find the user send this token if we have no users for this token then  just throw error (2)
  // * if we find user send this token then check the timeout is over 3 minutes or not? if it's over just throw error of token expires (3)
  // * if token timeout valid allow user enter password and password confirm, check identical or not, if not just throw error (done by schema which will validate data(req.body))
  // * if identical just update new password remove the password confirm, reset token, token timeout because we don't want save these to our DB, update password changed at date and also the updated at date (4)
  // ? (1), (2), (3), (4) done in reset password service
  await resetPwdServiceV0({ token, password })
  // * then after success we can redirect the user to the login page to user can login with new password

  res.redirect(`${CLIENT_ORIGIN}/login`)
}

export default {
  login,
  signup,
  logout,
  signToken,
  loginWithGoogle,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkResetPasswordToken,
  updateCurrentUser
}
