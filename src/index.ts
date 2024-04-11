import 'dotenv/config'
import './api/database'
import { appConfig } from './config'
import app from './app'
import { Email, log } from './api/utils'

const { appEmitter } = appConfig

const port = process.env.PORT || 3009

const server = app.listen(port, () => {
  log.info(`Server is listening at port ${port}`)
  log.info(`Documentation available at http://localhost:${port}/docs`)
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

process.on('unhandledRejection', (err: Error) => {
  log.error(err.name, err.message)
  log.error(err, 'UNHANDLED REJECTION ERROR!')
  server.close(() => {
    log.info('Application is shutting down !')
    process.exit(1)
  })
})
