import express from 'express'
import { swagger } from './config'

const app = express()

app.use(swagger)

export default app
