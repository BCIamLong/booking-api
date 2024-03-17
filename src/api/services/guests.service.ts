import { Guest } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { IGuest } from '../interfaces'
// import { AppError } from '../utils'

const fetchGuests = fetchAll<IGuest>(Guest)
const fetchGuest = fetchOne<IGuest>(Guest)
const createGuest = createOne<IGuest>(Guest)
const editGuest = editOne<IGuest>(Guest)
const removeGuest = removeOne<IGuest>(Guest)

export default { fetchGuest, fetchGuests, createGuest, editGuest, removeGuest }

// const fetchGuests = async function () {
//   const guests = await Guest.find()

//   return guests
// }
// const fetchGuest = async function (id: string) {
//   const guest = await Guest.findById(id)
//   if (!guest) throw new AppError(404, 'No guest found with this id')

//   return guest
// }
// const createGuest = async function (newGuest: Omit<IGuest, '_id' | 'createdAt' | 'updatedAt'>) {
//   const guest = await Guest.create(newGuest)

//   return guest
// }
// const editGuest = async function (id: string, editData: Partial<IGuest>) {
//   const guest = Guest.findByIdAndUpdate(id, editData, {
//     new: true,
//     runValidators: true
//   })
//   if (!guest) throw new AppError(404, 'No guest found with this id')

//   return guest
// }
// const removeGuest = async function (id: string) {
//   const isDeleted = await Guest.findByIdAndDelete(id)
//   // const isDeleted = await Guest.findOne({ _id: id })
//   if (!isDeleted) throw new AppError(404, 'No guest found with this id')
// }

// export default { fetchGuest, fetchGuests, createGuest, editGuest, removeGuest }
