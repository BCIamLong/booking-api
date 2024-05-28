import path from 'path'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import hpp from 'hpp'
import compression from 'compression'

import { swagger } from './config'
import router from './api/routes'
import { errorsHandler as globalErrorsHandler } from './api/middlewares'
import { AppError } from './api/utils'
import { loggerConfig, appConfig } from './config'
// import './config/modules.d'

const { accessLogStream } = loggerConfig
const { COMPRESSION_LEVEL } = appConfig
const app = express()

// *https://express-rate-limit.mintlify.app/reference/configuration
// const allowlist = ['192.168.0.56', '192.168.0.21']
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  handler: (req, res, next, options) =>
    res.status(options.statusCode).json({ status: 'fails', message: 'Too much requests' })
  // skip: (req, res) => allowlist.includes(req.ip!),
  // skip: (req, res) => req.user?.role === 'admin',
  // legacyHeaders: false,
  // message: 'Too much requests'
  // statusCode: 429
  // store: ... , // Redis, Memcached, etc. See below.
})

// const whitelist = ['http://localhost:5173', 'https://checkout.stripe.com']

// const corsOptions = {
//   origin: function (origin, callback: (err: Error | null, allow?: boolean) => void) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

// * default level is -1: which is point to 6
// * https://www.npmjs.com/package/compression?activeTab=readme
app.use(compression({ level: COMPRESSION_LEVEL }))

app.use(cors<Request>(corsOptions))
// app.use(
//   cors({
//     origin: ['http://localhost:5173', 'https://checkout.stripe.com']
//   })
// )

// app.use(cors())

// app.use(function (req: Request, res: Response, next: NextFunction) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })

app.options('*', cors())

app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))
app.use(limiter)
app.use(
  hpp({
    whitelist: ['sort']
  })
)

app.use(swagger)

// if (process.env.NODE_ENV === 'development') app.use(morgan('dev', { stream: accessLogStream }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
if (process.env.NODE_ENV === 'production') app.use(morgan('combined', { stream: accessLogStream }))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '90kb' }))
app.use(bodyParser.urlencoded({ extended: true }))

// if (process.env.NODE_ENV === 'production')
//   app.use((req: Request, res: Response, next: NextFunction) => {
//     if (!req.secure) return next(new AppError(400, 'Your request is not secure'))
//     next()
//   })

app.use(router)

app.all('*', (req: Request, res: Response, next: NextFunction) =>
  next(new AppError(404, 'Sorry, the page you are looking for could not be found'))
)

app.use(globalErrorsHandler)

export default app
