// import util from 'util'
import { Model } from 'mongoose'
import { createClient } from 'redis'
// import { dbConfig } from '~/config'
// const { REDIS_URI } = dbConfig
import { jwtConfig } from '~/config'

const redisClient = createClient()
const { REFRESH_TOKEN_EXPIRES } = jwtConfig
// redisClient.set = util.promisify(redisClient.set) //! we don't need to do it now from v4 Redis all the functions from redis client are come with native promisify

// * IT IS COMMON IF WE CREATE METHOD LIKE CRUD TO QUERY TO REDIS INSTEAD OF IMPORT REDIS CLIENT AND DEAL DIRECTLY
// * SO IT HELPS US ENCAPSULATE THE LOGICS IN ONE PLACE AND USUALLY THE QUERY METHODS LIKE THIS WILL BE IN THE REPOSITORIES BUT OF COURSE IN THIS CASE IN THIS PROJECT WE USE MONGOOSE AND MONGOOSE ITSELF IS ALSO LIKE THE REPOSITORY IT PROVIDE US MANY QUERY METHODS RIGHT
// * BUT WITH REDIS IN THIS CASE WE JUST CACHE THEN JUST PUT ALL OF THESE QUERY METHOD RIGHT HERE

const getCache = async function <T>({ key, hashKey = '', model }: { key: string; hashKey?: string; model: Model<T> }) {
  let data
  if (hashKey) {
    // ! WE DON'T USE NEW MODEL() TO CONVERT THE DATA BACK TO DOCUMENT OF MONGOOSE BECAUSE IT WILL TRY TO CREATE NEW ONE AND OF COURSE IT WILL CREATE THE CONFLICT BECAUSE THIS DATA IS ALREADY EXIST IN OUR DB RIGHT THEN IT CAN CREATE THE CONFLICT LIKE DUPLICATE ID
    // * THEREFORE WE NEED TO USE MODEL.HYDRATE BASICALLY COVERT THE DATA BACK TO MONGO DOCUMENT AND DON'T TRY TO CREATE NEW ONE SO THAT'S WHAT WE WANT IN THIS CASE
    const dataRaw = await redisClient.hGet(hashKey, key)
    data = JSON.parse(dataRaw!)
    if (Array.isArray(data)) return data.map((item) => model.hydrate(item))

    return model.hydrate(data)
  }

  data = await redisClient.get(key)
  return model.hydrate(JSON.parse(data!))
}

const setCache = async function (key: string, hashKey: string = '', value: string) {
  if (!hashKey)
    return await redisClient.set(key, value, {
      // * the expire of the this user session === refresh token time (and it's only delete when the user is logout)
      EX: Number(REFRESH_TOKEN_EXPIRES)
    })

  return await Promise.all([
    redisClient.hSet(hashKey, key, value),
    redisClient.expire(hashKey, Number(REFRESH_TOKEN_EXPIRES))
  ])
}

const deleteCache = async function (key: string, hashKey: string = '') {
  if (!hashKey) return await redisClient.del(key)

  return await redisClient.hDel(hashKey, key)
}

export default { redisClient, getCache, deleteCache, setCache }
