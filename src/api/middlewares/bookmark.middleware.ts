import { NextFunction, Request, Response } from 'express'

const bookmarksQueryModifier = async function (req: Request, res: Response, next: NextFunction) {
  const { cabinId } = req.params
  if (cabinId) {
    if (req.method === 'POST') {
      req.body.cabin = cabinId
      req.body.user = req.user.id
      // console.log('middleware', req.body)
      return next()
    }
    req.query.cabin = cabinId
    return next()
  }

  if (req.baseUrl.split('/').includes('me')) req.query.user = req.user.id

  next()
}

export default { bookmarksQueryModifier }
