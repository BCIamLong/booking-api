import { NextFunction, Request, Response } from 'express'

import authMiddleware from './auth.middleware'

const { authorize } = authMiddleware

const bookingsQueryModifier = async function (req: Request, res: Response, next: NextFunction) {
  const { cabinId } = req.params

  if (req.baseUrl.split('/').includes('me')) {
    req.query.guestId = req.user.id
    return next()
  }

  if (cabinId) {
    req.query.cabinId = cabinId
    return next()
  }

  return authorize('admin')(req, res, next)
}

export default { bookingsQueryModifier }
