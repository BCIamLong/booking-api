import { ObjectSchema, ValidationResult } from 'joi'
import cabinSchema from './cabin.schema'
import guestSchema from './guest.schema'
import settingSchema from './setting.schema'
import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils'

export const validator = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error }: ValidationResult = schema.validate(req.body)

  if (error) return next(new AppError(400, error.message))

  next()
}

export { cabinSchema, guestSchema, settingSchema }
