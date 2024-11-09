import { NextFunction, Request, Response } from 'express'
import crypto from 'crypto'

const setUpVerifyEmail = async function (req: Request, res: Response, next: NextFunction) {
  try {
    req.body['verifyEmail'] = true

    next()
  } catch (err) {
    next(err)
  }
}

export default { setUpVerifyEmail }
