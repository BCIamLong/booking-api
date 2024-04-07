import { Request, Response } from 'express'
import { cabinsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'
import { ICabin } from '../interfaces'
import { QueryStr } from '../utils/APIFeatures'

const { fetchCabins, fetchCabin, editCabin, createCabin, removeCabin } = cabinsService

const getCabins = getAll(async (options) => {
  const { data, collectionName } = await fetchCabins(options.queryStr!)
  return { data, collectionName }
})

const getCabin = getOne(async (options) => {
  const { data, collectionName } = await fetchCabin(options.id || '')
  return { data, collectionName }
})

const postCabin = postOne(async (options) => {
  const { data, collectionName } = await createCabin(options.body || {})

  return { data, collectionName }
})

const updateCabin = updateOne(async (options) => {
  const { data, collectionName } = await editCabin(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteCabin = deleteOne(async (options) => {
  const { data, collectionName } = await removeCabin(options.id || '')

  return { data, collectionName }
})

export default { getCabins, getCabin, postCabin, updateCabin, deleteCabin }

// const getCabins = async function (req: Request, res: Response) {
//   const { data: cabins } = await fetchCabins()

//   res.json({
//     status: 'success',
//     data: {
//       cabins
//     }
//   })
// }
// const getCabin = async function (req: Request, res: Response) {
//   const { data: cabin } = await fetchCabin(req.params.id)

//   res.json({
//     status: 'success',
//     data: {
//       cabin
//     }
//   })
// }
// const postCabin = async function (req: Request, res: Response) {
//   const { data: cabin } = await createCabin(req.body)

//   res.status(201)
//   res.json({
//     status: 'success',
//     data: {
//       cabin
//     }
//   })
// }
// const updateCabin = async function (req: Request, res: Response) {
//   const { data: cabin } = await editCabin(req.params.id, req.body)

//   res.json({
//     status: 'success',
//     data: {
//       cabin
//     }
//   })
// }
// const deleteCabin = async function (req: Request, res: Response) {
//   await removeCabin(req.params.id)

//   res.status(204)
//   res.json({
//     status: 'success',
//     data: null
//   })
// }

// export default { getCabins, getCabin, postCabin, updateCabin, deleteCabin }
