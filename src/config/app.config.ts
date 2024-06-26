import { EventEmitter } from 'events'
import { IBooking, ICabin, IGuest, IUser } from '~/api/interfaces'
import { log } from '~/api/utils'

const PAGE_LIMIT = 6
const COMPRESSION_LEVEL = 6
const CLIENT_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? (process.env.CLIENT_ORIGIN_CLOUD as string)
    : (process.env.CLIENT_ORIGIN as string)
const SERVER_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://booking-api-ebe1.onrender.com'
    : `http://localhost:${process.env.PORT}`
const DELETE_ACCOUNT_TIMEOUT = Number(process.env.DELETE_ACCOUNT_TIMEOUT)

process.on('uncaughtException', (err: Error) => {
  log.error(err, 'UNCAUGHT EXCEPTION ERROR!')
  process.exit(1)
})

class AppEmitter extends EventEmitter {
  constructor() {
    super()
  }
  signup(user: IGuest, url: string) {
    // console.log('ok')
    this.emit('signup', user, url)
    return
  }

  resetPassword(user: IGuest | IUser, url: string) {
    // console.log('ok')
    this.emit('reset-password', user, url)
    return
  }

  bookingSuccess(user: IGuest | IUser, booking: IBooking & { cabinId: string | ICabin }, url: string) {
    // console.log('ok')
    this.emit('booking-success', user, booking, url)
    return
  }
}

const appEmitter = new AppEmitter()

export default { CLIENT_ORIGIN, SERVER_ORIGIN, DELETE_ACCOUNT_TIMEOUT, appEmitter, PAGE_LIMIT, COMPRESSION_LEVEL }
