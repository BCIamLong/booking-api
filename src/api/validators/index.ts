import { ObjectSchema, ValidationResult } from 'joi'
import { NextFunction, Request, Response } from 'express'

import { AppError } from '../utils'
import cabinSchema from './cabin.schema'
import guestSchema from './guest.schema'
import settingSchema from './setting.schema'
import bookingSchema from './booking.schema'
import userSchema from './user.schema'
import authSchema from './auth.schema'
import reviewSchema from './review.schema'

export const validator = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.file, req.body)
  if (req.file) {
    const { originalname, size, mimetype } = req.file
    req.body.avatar = { originalname, size, mimetype }
  }
  const { error }: ValidationResult = schema.validate(req.body)

  if (error) return next(new AppError(400, error.message))

  next()
}

export { cabinSchema, guestSchema, settingSchema, bookingSchema, userSchema, authSchema, reviewSchema }
