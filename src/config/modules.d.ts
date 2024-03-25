import { IGuest, IUser } from '~/api/interfaces'

declare module 'express-serve-static-core' {
  // * for authentication and authorization purposes
  interface Request {
    user: Omit<IUser, 'passwordConfirm'> | Omit<IGuest, 'passwordConfirm'>
  }
}
