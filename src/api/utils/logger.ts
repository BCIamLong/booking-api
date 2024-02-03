import logger from 'pino'
import dayjs from 'dayjs'

const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      sync: process.env.NODE_ENV !== 'test' //* for test in jest because in jest when we're testing it's async task and then our log should be handle and also set to async like this we set sync to false that mean it's async
    }
  },
  base: {
    pid: false
  },
  timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DDT:HH:mm')}"`
  // timestamp: () => `"time": "Hello"`

  // * dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A') // display format option we can set up as we want with dayjs to display time as we want
})

export default log
