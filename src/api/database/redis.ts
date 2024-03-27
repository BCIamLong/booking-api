// import util from 'util'
import { createClient } from 'redis'
// import { dbConfig } from '~/config'
// const { REDIS_URI } = dbConfig

const redisClient = createClient()
// redisClient.set = util.promisify(redisClient.set) //! we don't need to do it now from v4 Redis all the functions from redis client are come with native promisify

export default { redisClient }
