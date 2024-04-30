import { NextFunction, Request, Response } from 'express'

const bookmarksQueryModifier = async function (req: Request, res: Response, next: NextFunction) {
  const { cabinId } = req.params

  if (cabinId) {
    if (req.method === 'POST') {
      req.body.cabin = cabinId
      req.body.user = req.user.id
    }

    return next()
  }

  next()
}

export default { bookmarksQueryModifier }
