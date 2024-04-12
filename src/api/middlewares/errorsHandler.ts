import { AppError, log } from '../utils'
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
  console.log(err.isOperation)
  if (err.isOperation)
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })

  res.status(500).json({
    status: 'error',
    message: 'Something went wrong'
  })
}

interface CustomError extends AppError {
  code: number
  keyValue: { name: string }
}

const castErrorHandler = () =>
  new AppError(409, `Oops! It seems that the data you are trying to save already exists.`) as CustomError

const bsonErrorHandler = () =>
  new AppError(400, `An error occurred while processing your request. Please try again later.`) as CustomError

const validationErrorHandler = () =>
  new AppError(400, `Validation failed. Please check your input data and try again.`) as CustomError

const jwtErrorHandler = () => new AppError(401, `Authentication failed. Please login again.`) as CustomError

const expiredTokenErrorHandler = () =>
  new AppError(401, `Authentication token has expired. Please login again.`) as CustomError

export default function (err: AppError, req: Request, res: Response, next: NextFunction) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  const { isOperation, statusCode, status, message, code, name } = err as CustomError
  let prodErr = { ...err, isOperation, statusCode, status, message, code } as CustomError

  if (process.env.NODE_ENV === 'development') devErrorHandler(err, res)
  log.error(err, err.message)

  if (process.env.NODE_ENV !== 'production') return
  log.error(prodErr, 'Product Error')

  if (prodErr?.code === 11000) prodErr = castErrorHandler() //Mongo DB
  if (prodErr?.name === 'BSONError') prodErr = bsonErrorHandler() //Mongo DB
  if (prodErr?.name === 'ValidationError') prodErr = validationErrorHandler() //Mongo DB
  if (prodErr?.name === 'JsonWebTokenError') prodErr = jwtErrorHandler() //JWT
  if (prodErr?.name === 'TokenExpiredError') prodErr = expiredTokenErrorHandler() //JWT

  prodErrorHandler(prodErr, res)
}
