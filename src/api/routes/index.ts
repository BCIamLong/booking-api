import { Router } from 'express'
import cabinsRouter from './cabins.route'

const router = Router()

router.use('/api/v1/cabins', cabinsRouter)

export default router
