import { schedule } from 'node-cron'
import https from 'https'
// import http from 'http'

// * http for check in development

import { log } from '~/api/utils'
import { appConfig } from './config'

const { SERVER_ORIGIN } = appConfig

// * we want do it after 14 mins because at 15 mins server will auto sleep on render free
const job = schedule('*/14 * * * *', function () {
  log.info('RESTARTING SERVER')
  https
    .get(`${SERVER_ORIGIN}/health-check`, (res) => {
      if (res.statusCode === 200) log.info('SERVER RESTARTED')
      else log.error(`FAILED TO RESTART SERVER WITH STATUS CODE: ${res.statusCode}`)
    })
    .on('error', (err) => {
      log.error('ERROR DURING RESTART PROCESS', err.message)
    })
})

export default job
