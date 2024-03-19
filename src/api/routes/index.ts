import { Router } from 'express'
import cabinsRouter from './cabins.route'
import guestRouter from './guests.route'
import settingsRouter from './settings.route'
import bookingRouter from './bookings.route'

const router = Router()

router.use('/api/v1/cabins', cabinsRouter)
router.use('/api/v1/guests', guestRouter)
router.use('/api/v1/settings', settingsRouter)
router.use('/api/v1/bookings', bookingRouter)

export default router
