import { Router } from 'express'
import cabinsRouter from './cabins.route'
import guestRouter from './guests.route'
import settingsRouter from './settings.route'
import bookingRouter from './bookings.route'
import userRouter from './users.route'
import { IGuest, IUser } from '../interfaces'

const router = Router()

// * https://stackoverflow.com/questions/71122741/how-do-i-add-custom-property-to-express-request-in-typescript
declare module 'express-serve-static-core' {
  // * for authentication and authorization purposes
  interface Request {
    user: Omit<IUser, 'passwordConfirm'> | Omit<IGuest, 'passwordConfirm'>
    token: string
  }
}
interface Options {
  key: string
  type: 'cache' | 'session'
}

declare module 'mongoose' {
  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
    cache(options: Options): this
    isCached: boolean
    hashKey: string
    key: string
  }
}

declare module 'jsonwebtoken' {
  interface JwtPayload {
    id: string
  }
}

/**
 * @openapi
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 *   cookieAuth:
 *    type: apiKey
 *    in: cookie
 *    name: access-token
 *   refreshCookieAuth:
 *    type: apiKey
 *    in: cookie
 *    name: refresh-token
 *    description: Use this when access token expires
 */

router.use('/api/v1/users', userRouter)
router.use('/api/v1/cabins', cabinsRouter)
router.use('/api/v1/guests', guestRouter)
router.use('/api/v1/settings', settingsRouter)
router.use('/api/v1/bookings', bookingRouter)

export default router
