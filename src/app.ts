import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { swagger } from './config'
import router from './api/routes'
import { errorsHandler as globalErrorsHandler } from './api/middlewares'
import { AppError } from './api/utils'

const app = express()

app.use(cors())
app.options('*', cors())
app.use(swagger)

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '90kb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router)

app.all('*', (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(404, 'Sorry, the page you are looking for could not be found'))
)

app.use(globalErrorsHandler)

export default app
