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

const authenticate = async function (req: Request, res: Response, next: NextFunction) {
  try {
    // console.log(req.cookies['access-token'])
    // * check token (notice that because we set cookie with form like access-token so we need to use req.cookies['access-token'] not req.cookies.accessToken likewise (tuong tu nhu vay) with refresh-token)
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies['access-token'] || req.cookies['refresh-token']

    if (!token) return next(new AppError(401, 'Please login to perform this action'))

    // * decoded token and check token expires or not
    let decoded: CustomJwtPayload
    if (req.cookies['access-token']) decoded = jwt.verify(token, ACCESS_TOKEN_SECRET!) as CustomJwtPayload
    else decoded = jwt.verify(token, REFRESH_TOKEN_SECRET!) as CustomJwtPayload
    // ||  jwt.verify(token,REFRESH_TOKEN_SECRET!)

    // * decoded.iat is time sign of token, decoded.exp is time expires of token
    if (decoded.exp! * 1000 < Date.now()) return next(new AppError(401, 'Your login turn expires, please login again'))
    // if (decoded.iat! * 1000 < Date.now()) return next(new AppError(401, 'Your login turn expires, please login again'))
    // * check user exist or not
    let user = await Guest.findById(decoded.id)
    if (!user) user = await User.findById(decoded.id)
    if (!user) return next(new AppError(401, 'This use recently has been deleted, please contact us for more info'))

    // * check user recently have changed password or not?
    if (new Date(user.passwordChangedAt!) >= new Date())
      return next(new AppError(401, 'This use recently has changed password, please login again'))

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

const authorize =
  (...rules: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!rules.includes(req.user.role!))
      return next(new AppError(403, "You don't have permission to perform this action"))

    next()
  }

export default { authenticate, authorize }
