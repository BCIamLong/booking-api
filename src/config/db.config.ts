import mongoose, { Document, Model, model, Schema, Query } from 'mongoose'
import { RedisClientType, createClient } from 'redis'
import jwtConfig from './jwt.config'

const { REFRESH_TOKEN_EXPIRES } = jwtConfig
const DB_CLOUD_URI = process.env.MONGODB_CLOUD?.replace('<password>', process.env.MONGODB_CLOUD_PASSWORD!)

// declare module 'mongoose' {
//   interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType> {
//     cache: (options: Options) => this
//     isCached: boolean
//     hashKey: string
//   }
// }

interface Options {
  key: string
  type: 'cache' | 'session'
}

const mongooseConfigWithRedis = async function (redisClient: ReturnType<typeof createClient>) {
  const exec = mongoose.Query.prototype.exec
  mongoose.Query.prototype.cache = function (options: Options) {
    this.isCached = true

    if (options.type === 'cache') this.hashKey = options.key || ''
    else this.key = options.key

    return this
  }

  mongoose.Query.prototype.exec = async function () {
    try {
      const hashKey = this.hashKey

      // arguments
      if (!this.isCached) return exec.apply(this, [])

      const key = JSON.stringify({
        ...this.getQuery(),
        collection: this.model.collection.name
      })

      const result = await exec.apply(this, [])
      if (this.key) {
        await redisClient.set(this.key, JSON.stringify(result), {
          // * the expire of the this user session === refresh token time (and it's only delete when the user is logout)
          EX: Number(REFRESH_TOKEN_EXPIRES)
        })

        return result
      }

      const cacheVal = !hashKey ? await redisClient.get(key) : await redisClient.hGet(hashKey, key)
      const data = JSON.parse(cacheVal!)

      if (!hashKey) {
        if (cacheVal) return new this.model(data)

        redisClient.set(key, JSON.stringify(result))
        return result
      }

      if (cacheVal)
        return Array.isArray(data)
          ? data.map((item) => {
              return new this.model(item)
            })
          : new this.model(data)

      redisClient.hSet(hashKey, key, JSON.stringify(result))

      return result
    } catch (err: any) {
      console.log(err)
      throw new Error(err.message)
    }
  }
}

let redisClient = createClient({
  socket: {
    connectTimeout: 10000
  }
})

if (process.env.NODE_ENV === 'production')
  redisClient = createClient({
    password: process.env.REDIS_CLOUD_PWD,
    socket: {
      host: process.env.REDIS_CLOUD_HOST,
      port: +process.env.REDIS_CLOUD_PORT!
    }
  })

export default {
  // DB_URI: process.env.NODE_ENV === 'production' ? DB_CLOUD_URI : process.env.MONGODB_LOCAL,
  DB_URI: DB_CLOUD_URI,
  REDIS_URI: process.env.REDIS_LOCAL,
  mongooseConfigWithRedis,
  redisClient
}
