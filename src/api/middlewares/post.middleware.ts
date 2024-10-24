import { NextFunction, Request, Response } from 'express'
import { Booking, Post } from '../database/models'
import { AppError } from '../utils'

const checkPostCreateAbility = async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { tourId, userId } = req.body

    const isTourBooked = await Booking.findOne({ cabinId: tourId, guestId: userId })
    if (!isTourBooked) return next(new AppError(400, 'Bad request'))

    const isPostExisted = await Post.findOne({ tourId })
    if (isPostExisted) return next(new AppError(400, 'Bad request'))

    next()
  } catch (err) {
    next(err)
  }
}

export default { checkPostCreateAbility }
