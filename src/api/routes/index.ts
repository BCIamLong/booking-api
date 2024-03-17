import { Router } from 'express'
import cabinsRouter from './cabins.route'
import guestRouter from './guests.route'

const router = Router()

router.use('/api/v1/cabins', cabinsRouter)
router.use('/api/v1/guests', guestRouter)

export default router
