import mongoose from 'mongoose'
import { log } from '../utils'
import { dbConfig } from '~/config'
import redis from './redis'
const { DB_LOCAL, REDIS_URI, mongooseConfigWithRedis } = dbConfig
const { redisClient } = redis

const connectDB = async () => {
  try {
    await redis.redisClient.connect()
    log.info('Connect Redis successfully')
    await mongoose.connect(DB_LOCAL!)
    log.info('Connect DB successfully')
  } catch (err: any) {
    log.error(err, err.message)
  }
}

mongooseConfigWithRedis(redisClient)
connectDB()
