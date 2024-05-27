import { Request, Response } from 'express'
import { guestsService, authService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'

const { fetchGuests, fetchGuest, editGuest, createGuest, removeGuest } = guestsService
const { checkEmailExist } = authService

const getGuests = getAll(async () => {
  const { data, collectionName, count } = await fetchGuests()
  return { data, collectionName, count }
})

const getGuest = getOne(async (options) => {
  const { data, collectionName } = await fetchGuest(options.id || '')
  return { data, collectionName }
})

const postGuest = postOne(async (options) => {
  await checkEmailExist('admin', options.body.email)

  const { data, collectionName } = await createGuest(options.body || {})

  return { data, collectionName }
})

const updateGuest = updateOne(async (options) => {
  const { data, collectionName } = await editGuest(options.id || '', options.body || {})

  return { data, collectionName }
})

const deleteGuest = deleteOne(async (options) => {
  const { data, collectionName } = await removeGuest(options)
  // const { data, collectionName } = await removeGuest(options.id || '')

  return { data, collectionName }
})

export default { getGuests, getGuest, postGuest, updateGuest, deleteGuest }

// const getGuests = async function (req: Request, res: Response) {
//   const guests = await fetchGuests()

//   res.json({
//     status: 'success',
//     data: {
//       guests
//     }
//   })
// }
// const getGuest = async function (req: Request, res: Response) {
//   const guest = await fetchGuest(req.params.id)

//   res.json({
//     status: 'success',
//     data: {
//       guest
//     }
//   })
// }
// const postGuest = async function (req: Request, res: Response) {
//   const guest = await createGuest(req.body)

//   res.status(201)
//   res.json({
//     status: 'success',
//     data: {
//       guest
//     }
//   })
// }
// const updateGuest = async function (req: Request, res: Response) {
//   const guest = await editGuest(req.params.id, req.body)

//   res.json({
//     status: 'success',
//     data: {
//       guest
//     }
//   })
// }
// const deleteGuest = async function (req: Request, res: Response) {
//   await removeGuest(req.params.id)

//   res.status(204)
//   res.json({
//     status: 'success',
//     data: null
//   })
// }

// export default { getGuests, getGuest, postGuest, updateGuest, deleteGuest }
