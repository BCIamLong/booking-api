import { Router } from 'express'
import toursController from '../controllers/tours.controller'
import { asyncCatch } from '../utils'

const { deleteTour, getTour, getTours, updateTour, postTour } = toursController

const toursRouter = Router()

toursRouter.route('/').get(asyncCatch(getTours)).post(asyncCatch(postTour))

toursRouter.route('/:id').get(asyncCatch(getTour)).patch(asyncCatch(updateTour)).delete(asyncCatch(deleteTour))

export default toursRouter
