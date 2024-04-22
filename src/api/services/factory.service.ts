import { Model } from 'mongoose'
import { AppError } from '../utils'
import { APIFeatures } from '../utils'
import { QueryStr } from '../utils/APIFeatures'

const fetchAll =
  <T>(Model: Model<T>) =>
  async (queryStr?: QueryStr): Promise<{ data: T[]; count: number; collectionName: string }> => {
    const count = await Model.countDocuments()
    const apiFeatures = new APIFeatures<T>(Model.find(), queryStr).filter().sort().selectFields().pagination(count)
    let query
    if (queryStr) query = apiFeatures.query
    else query = Model.find()

    const data = await query

    return { data, count, collectionName: Model.collection.collectionName }
  }

const fetchOne =
  <T>(Model: Model<T>) =>
  async (id: string) => {
    const data = await Model.findById(id)
    if (!data) throw new AppError(404, `No ${Model.collection.collectionName} found with this id`)

    return { data, collectionName: Model.collection.collectionName }
  }

const createOne =
  <T, U>(Model: Model<T>) =>
  async (data: Omit<U, 'createdAt' | 'updatedAt'>) => {
    const newData = await Model.create(data)

    return { data: newData, collectionName: Model.collection.collectionName }
  }

// * This is using for something like this:
// * { $unset: { otp2FAAuthUrl: 1, otp2FAToken: 1 }, enable2FA: false }
// * $unset is operation(we can do more operations here), enable2FA is field we want to update value
interface UpdateOperations {
  $unset?: { otp2FAAuthUrl: number; otp2FAToken: number; verify2FAOtp: number }
}

const editOne =
  <T>(Model: Model<T>) =>
  async (id: string, editData: Partial<T> & UpdateOperations, validate: boolean = true, cache: boolean = false) => {
    let query = Model.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: validate
    })
    const collectionName = Model.collection.collectionName
    let formatCollectionName = collectionName.slice(0, collectionName.length - 1).toLowerCase()
    // console.log(formatCollectionName)
    if (formatCollectionName === 'user' || formatCollectionName === 'guest') formatCollectionName = 'user'

    if (cache) query = query.cache({ key: formatCollectionName, type: 'session' })

    const data = await query
    if (!data) throw new AppError(404, `No ${collectionName} found with this id`)

    return { data, collectionName: Model.collection.collectionName }
  }

const removeOne =
  <T>(Model: Model<T>) =>
  async (id: string) => {
    const data = await Model.findByIdAndDelete(id)
    // const isDeleted = await Cabin.findOne({ _id: id })
    if (!data) throw new AppError(404, `No ${Model.collection.collectionName} found with this id`)

    return { data, collectionName: Model.collection.collectionName }
  }

export { fetchAll, fetchOne, createOne, editOne, removeOne }
