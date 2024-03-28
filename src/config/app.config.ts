import { EventEmitter } from 'events'
import { IGuest } from '~/api/interfaces'

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN as string

class AppEmitter extends EventEmitter {
  constructor() {
    super()
  }
  signup(user: IGuest, url: string) {
    // console.log('ok')
    this.emit('signup', user, url)
    return
  }
}

const appEmitter = new AppEmitter()

export default { CLIENT_ORIGIN, appEmitter }
