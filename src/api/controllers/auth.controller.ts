import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { authService } from '../services'
import { jwtConfig } from '~/config'
import { IGuest, IUser } from '../interfaces'

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = jwtConfig
const { loginService, signupService } = authService

const signToken = function (type: 'access' | 'refresh', user: IUser | IGuest) {
  const secret = type === 'access' ? ACCESS_TOKEN_SECRET! : REFRESH_TOKEN_EXPIRES!
  return jwt.sign({ id: user._id }, secret, {
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
  const accessToken = signToken('access', newUser)
  const refreshToken = signToken('refresh', newUser)
  // * store user data to session or something like that (protected middleware will do this task)
  // * send back access token if we have no error
  setCookies(res, accessToken, refreshToken)
  res.json({
    status: 'success',
    token: accessToken
  })
}

export default { login, signup, signToken }
