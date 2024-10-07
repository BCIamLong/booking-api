import { Tour } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { ITour } from '../interfaces'
import { ITourInput } from '../interfaces/ITour'
// import { AppError } from '../utils'

const fetchTours = fetchAll<ITour>(Tour)
const fetchTour = fetchOne<ITour>(Tour)
const createTour = createOne<ITour, ITourInput>(Tour)
const editTour = editOne<ITour>(Tour)
const removeTour = removeOne<ITour>(Tour)

export default { fetchTour, fetchTours, createTour, editTour, removeTour }
