import logger from 'pino'
import dayjs from 'dayjs'

// * https://github.com/pinojs/pino/blob/master/docs/asynchronous.md
// * https://www.youtube.com/watch?v=2kKeQl_m8iY
const log = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      // translateTime: true, //* translate time like MM DD but here we use timestamp option bellow then we don't need to do this
      colorize: true,
      sync: process.env.NODE_ENV !== 'test' //* for test in jest because in jest when we're testing it's async task and then our log should be handle and also set to async like this we set sync to false that mean it's async
    }
  },
  base: {
    // pid: false //* to customize the () name in this () like hostname, pid in our log on terminal
    pid: 'longhoang'
  },
  timestamp: () => `,"time":"${dayjs().format('YYYY-MM-DDT:HH:mm')}"`
  // timestamp: () => `"time": "Hello"`

  // * dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A') // display format option we can set up as we want with dayjs to display time as we want
})

export default log
