import { NextFunction, Request, Response } from 'express'
import authMiddleware from './auth.middleware'

const { authorize } = authMiddleware

const reviewsQueryModifier = async function (req: Request, res: Response, next: NextFunction) {
  const { cabinId, userId, userSlug } = req.params

  if (cabinId) {
    req.query = { cabin: cabinId }
    // console.log('ok')
    return next()
  }
  // console.log('ok2')
  if (userSlug === 'me') {
    req.query = { user: req.user.id }
    return next()
  }

  if (userId) {
    req.query = { user: userId }
    return authorize('admin')
  }

  // ? here notice that we can use only userSlug but we need to think about how we can find the review based on the user slug not the id
  if (!cabinId || !userSlug) return authorize('admin')(req, res, next)

  return next()
}

const reviewQueryModifier = async function (req: Request, res: Response, next: NextFunction) {
  const { cabinId, userId, userSlug } = req.params
  if (cabinId) return next()
  if (userSlug) return next()
  if (userSlug === 'me') return next()

  if (!cabinId || userId || userSlug !== 'me') return authorize('admin')(req, res, next)
}

export default { reviewsQueryModifier, reviewQueryModifier }
