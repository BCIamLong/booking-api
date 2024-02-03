import mongoose from 'mongoose'
import { log } from '../utils'
import { dbConfig } from '~/config'
const { DB_LOCAL } = dbConfig

const connectDB = async () => {
  try {
    await mongoose.connect(DB_LOCAL!)
    log.info('Connect DB successfully')
  } catch (err) {
    log.error(err)
  }
}

connectDB()
