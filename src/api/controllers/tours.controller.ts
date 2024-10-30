import { Request, Response } from 'express'
import { toursService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { getToursAvailableToPostService } = toursService

const { fetchTours, fetchTour, editTour, createTour, removeTour } = toursService

const getTours = getAll(async (options) => {
  const { data, collectionName, count } = await fetchTours(options.queryStr!)
  return { data, collectionName, count }
})

const getTour = getOne(async (options) => {
  console.log(options)
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

const getToursAvailableToPost = async function (req: Request, res: Response) {
  // console.log(req.user)
  const tours = await getToursAvailableToPostService({ userId: req.user?.id })
  // console.log('ok')

  res.status(200).json({
    status: 'success',
    data: {
      tours
    }
  })
}

export default { getTours, getTour, postTour, updateTour, deleteTour, getToursAvailableToPost }
