import 'dotenv/config'
import './api/database'
import { appConfig } from './config'
import app from './app'
import { Email, log } from './api/utils'
import job from './cron'

const { appEmitter, SERVER_ORIGIN } = appConfig

const port = process.env.PORT || 3009
if (process.env.NODE_ENV === 'production') job.start()

const server = app.listen(port, () => {
  log.info(`Server is listening at port ${port}`)
  log.info(`Documentation available at ${SERVER_ORIGIN}/docs`)
})

appEmitter.on('signup', (user, url) => {
  // console.log('hello')
  const emailHost = new Email(user, url)
  emailHost.sendWelcomeMail()
})

appEmitter.on('reset-password', (user, url) => {
  // console.log('hello')
  const emailHost = new Email(user, url)
  emailHost.sendResetPwdMail()
})

appEmitter.on('booking-success', (user, booking, url) => {
  // console.log('hello')
  const emailHost = new Email(user, url)
  emailHost.sendBookingSuccessMail(booking)
})

process.on('unhandledRejection', (err: Error) => {
  log.error(err.name, err.message)
  log.error(err, 'UNHANDLED REJECTION ERROR!')
  server.close(() => {
    log.info('Application is shutting down !')
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  log.info('SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    log.info('💥 Process terminated')
    // *SIGTERM will automatically to shutdown our application so therefore we don't need to use process.exit() here
  })
})
