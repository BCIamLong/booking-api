import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { swagger } from './config'
import router from './api/routes'

const app = express()

app.use(swagger)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '90kb' }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(router)

export default app
