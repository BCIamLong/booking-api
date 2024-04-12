import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { AppError } from '../utils'
import { IGuest, IUser } from '../interfaces'
import { jwtConfig } from '~/config'
import { Guest, User } from '../database/models'

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = jwtConfig

// * instead of use custom request and overload the type of Request in express which will cause some error we can use: https://stackoverflow.com/questions/71122741/how-do-i-add-custom-property-to-express-request-in-typescript
// * so basically use declare module, and because we will use this authenticate route for other route and also need the user property in Request then we need to push it to global of routes so that in the index.ts routes file

// interface CustomRequest extends Request {
//   user: Omit<IUser, 'passwordConfirm'> | Omit<IGuest, 'passwordConfirm'>
// }

interface CustomJwtPayload extends JwtPayload {
  id: string
}

// !NOTE THAT SEND COOKIE HEADERS IS NOT POSSIBLE IN SWAGGER RIGHT NOW SO IF WE USE THE SWAGGER UI AND AUTHENTICATE WITH COOKIE THEN IT WILL NOT WORK
// * BUT FOR BEARER AUTH IT WILL WORK
// * WITH COOKIE WE CAN USE THE COOKIE FROM THE BROWSER LIKE WE CAN LEAVE THE BROWSER STORE THESE COOKIES AND THEN WE SEND COOKIE HEADERS THEN IT WILL WORK
// ! BUT IF WE DELETE THESE COOKIE FROM BROWSER AND DO IT WITH SWAGGER UI THEN IT WILL NOT POSSIBLE RIGHT NOW
// !https://stackoverflow.com/questions/49272171/sending-cookie-session-id-with-swagger-3-0

const authenticate = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(req.cookies['access-token'])
    // * check token (notice that because we set cookie with form like access-token so we need to use req.cookies['access-token'] not req.cookies.accessToken likewise (tuong tu nhu vay) with refresh-token)
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies['access-token'] || req.cookies['refresh-token']
    // console.log(req.cookies)
    // console.log(req.cookies['access-token'])
    // console.log(req.cookies['refresh-token'])
    if (!token) return next(new AppError(401, 'Please login to perform this action'))

    // * decoded token and check token expires or not
    let decoded: CustomJwtPayload
    if (req.cookies['access-token'] || req.headers.authorization?.split(' ')[1])
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as CustomJwtPayload
    else decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as CustomJwtPayload
    // ||  jwt.verify(token,REFRESH_TOKEN_SECRET!)

    // * decoded.iat is time sign of token, decoded.exp is time expires of token
    if (decoded.exp! * 1000 < Date.now()) return next(new AppError(401, 'Your login turn expires, please login again'))
    // if (decoded.iat! * 1000 < Date.now()) return next(new AppError(401, 'Your login turn expires, please login again'))
    // * check user exist or not
    let user: IGuest & IUser = (await Guest.findById(decoded.id)) as IGuest & IUser
    if (!user) user = (await User.findById(decoded.id)) as IGuest & IUser
    if (!user) return next(new AppError(401, 'This use recently has been deleted, please contact us for more info'))

    // * check user recently have changed password or not?
    // console.log(decoded.iat! >= new Date(user.passwordChangedAt!).getTime())
    if (new Date(user.passwordChangedAt!) >= new Date(decoded.iat! * 1000))
      return next(new AppError(401, 'This use recently has changed password, please login again'))

    if (!user.verifyEmail)
      return next(new AppError(401, 'Please check your email inbox and verify your email to start using our web app'))

    // if (user.enable2FA)
    //   if (!user.verify2FAOtp)
    //     return next(new AppError(403, 'Please verify your 2FA authentication to continue using our app'))

    const { _id: id, name, fullName, email, role = '', enable2FA = false, verify2FAOtp } = user

    req.user = {
      id,
      name: name || fullName,
      email,
      role,
      enable2FA
    }
    if (enable2FA) req.user.verify2FAOtp = verify2FAOtp

    next()
  } catch (err) {
    next(err)
  }
}

const auth2FA = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req
  if (user.enable2FA)
    if (!user.verify2FAOtp)
      return next(new AppError(403, 'Please verify your 2FA authentication to continue using our app'))

  next()
}

const authorize =
  (...rules: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!rules.includes(req.user.role!))
      return next(new AppError(403, "You don't have permission to perform this action"))

    next()
  }

export default { authenticate, authorize, auth2FA }
