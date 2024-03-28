import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { authService, guestsService } from '../services'
import { jwtConfig, appConfig } from '~/config'
import { IGuest, IUser } from '../interfaces'
import { AppError, Email } from '../utils'
import { JwtPayload } from 'jsonwebtoken'
import redis from '../database/redis'
// import { Document } from 'mongoose'

const { redisClient } = redis
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = jwtConfig
const { CLIENT_ORIGIN, appEmitter } = appConfig
const { loginService, signupService, getGoogleOauthTokens, getGoogleUser } = authService
const { findAndUpdateGuest, editGuest } = guestsService

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

  if (!token && !userSession) throw new AppError(400, 'Bad request')

  await editGuest(decoded?.id || JSON.parse(userSession!)._id, { verifyEmail: true })

  res.redirect(CLIENT_ORIGIN)
}

export default { login, signup, signToken, loginWithGoogle, verifyEmail }
