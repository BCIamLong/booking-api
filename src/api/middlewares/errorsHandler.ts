import { AppError } from '../utils'
import { NextFunction, Request, Response } from 'express'

const devErrorHandler = function (err: AppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  })
}
const prodErrorHandler = function (err: AppError, res: Response) {
  if (err.isOperation)
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  })
}

export default function (err: AppError, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') devErrorHandler(err, res)
  if (process.env.NODE_ENV === 'production') prodErrorHandler(err, res)
}
