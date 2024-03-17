import { Cabin } from '../database/models'
import { createOne, editOne, fetchAll, fetchOne, removeOne } from './factory.service'
import { ICabin } from '../interfaces'
// import { AppError } from '../utils'

const fetchCabins = fetchAll<ICabin>(Cabin)
const fetchCabin = fetchOne<ICabin>(Cabin)
const createCabin = createOne<ICabin>(Cabin)
const editCabin = editOne<ICabin>(Cabin)
const removeCabin = removeOne<ICabin>(Cabin)

export default { fetchCabin, fetchCabins, createCabin, editCabin, removeCabin }

// const fetchCabins = async function () {
//   const cabins = await Cabin.find()

//   return cabins
// }
// const fetchCabin = async function (id: string) {
//   const cabin = await Cabin.findById(id)
//   if (!cabin) throw new AppError(404, 'No cabin found with this id')

//   return cabin
// }
// const createCabin = async function (newCabin: Omit<ICabin, '_id' | 'createdAt' | 'updatedAt'>) {
//   const cabin = await Cabin.create(newCabin)

//   return cabin
// }
// const editCabin = async function (id: string, editData: Partial<ICabin>) {
//   const cabin = Cabin.findByIdAndUpdate(id, editData, {
//     new: true,
//     runValidators: true
//   })
//   if (!cabin) throw new AppError(404, 'No cabin found with this id')

//   return cabin
// }
// const removeCabin = async function (id: string) {
//   const isDeleted = await Cabin.findByIdAndDelete(id)
//   // const isDeleted = await Cabin.findOne({ _id: id })
//   if (!isDeleted) throw new AppError(404, 'No cabin found with this id')
// }

// export default { fetchCabin, fetchCabins, createCabin, editCabin, removeCabin }
