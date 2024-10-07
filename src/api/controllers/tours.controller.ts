import { toursService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchTours, fetchTour, editTour, createTour, removeTour } = toursService

const getTours = getAll(async () => {
  const { data, collectionName, count } = await fetchTours()
  return { data, collectionName, count }
})

const getTour = getOne(async (options) => {
  const { data, collectionName } = await fetchTour(options.id || '')
  return { data, collectionName }
})

const postTour = postOne(async (options) => {
  const { data, collectionName } = await createTour(options.body || {})

  return { data, collectionName }
})

const updateTour = updateOne(async (options) => {
  const { data, collectionName } = await editTour(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteTour = deleteOne(async (options) => {
  const { data, collectionName } = await removeTour(options)
  // const { data, collectionName } = await removeTour(options.id || '')

  return { data, collectionName }
})

export default { getTours, getTour, postTour, updateTour, deleteTour }
