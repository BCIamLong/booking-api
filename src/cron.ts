import { CronJob } from 'cron'
import https from 'https'
// import http from 'http'

// * http for check in development

import { log } from '~/api/utils'
import { appConfig } from './config'

const { SERVER_ORIGIN } = appConfig

const job = new CronJob('*/1 * * * *', function () {
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
