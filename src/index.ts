import 'dotenv/config'
import app from './app'
import { log } from './api/utils'
import './api/database'

const port = process.env.PORT || 3009

const server = app.listen(port, () => {
  log.info(`Server is listening at port ${port}`)
  log.info(`Documentation available at http://localhost:${port}/docs`)
})

process.on('unhandledRejection', (err: Error) => {
  log.error(err.name, err.message)
  log.error(err)
  server.close(() => {
    log.info('Application is shutting down !')
    process.exit(1)
  })
})
