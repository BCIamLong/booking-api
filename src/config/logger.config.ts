import fs from 'fs'
import path from 'path'
import { destination, levels, transport } from 'pino'

//* The 'a' flag alone, which you've used, opens the file for appending without creating it if it doesn't exist. By using 'a+', you ensure that the file is created if it's not already present.
// const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logs/app.access.log'), { flags: 'a' })
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../../logs/access/app.access.log'), { flags: 'a+' })
const transportConfig = transport({
  targets: [
    {
      // * with this log file now we just want to log the error logs to our log file right
      target: 'pino-pretty',
      level: 'error',
      options: {
        // destination: `./logs/app-${Date.now()}.log`,
        destination: `./logs/errors/app.error.log`,
        mkdir: true,
        colorize: false,
        sync: process.env.NODE_ENV !== 'test'
        // * append to false: to configure the transport to truncate (xuong dong) the file upon opening it for writing.
        // append: false
        // levels: 'info'
      }
    },
    {
      // * with this log file now we just want to log the error logs to our log file right
      target: 'pino-pretty',
      level: 'info',
      options: {
        // destination: `./logs/app-${Date.now()}.log`,
        destination: `./logs/app.log`,
        mkdir: true,
        colorize: false,
        sync: process.env.NODE_ENV !== 'test'
        // levels: 'info'
      }
    },
    {
      target: 'pino-pretty',
      level: 'info',
      // * to log to terminal as default STDOUT we can set the destination to 1 or process.stdout.fd
      // * and value of 2 is for STDERR
      options: { destination: 1, sync: process.env.NODE_ENV !== 'test' }
      // options: { destination: process.stdout.fd, sync: process.env.NODE_ENV !== 'test' }
    }
  ]
})

export default { transportConfig, accessLogStream }
