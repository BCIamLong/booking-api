import { Model } from 'mongoose'
import { AppError } from '../utils'

const fetchAll =
  <T>(Model: Model<T>) =>
  async () => {
    const data = await Model.find()

    return { data, collectionName: Model.collection.collectionName }
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

const editOne =
  <T>(Model: Model<T>) =>
  async (id: string, editData: Partial<T>, validate: boolean = true) => {
    const data = await Model.findByIdAndUpdate(id, editData, {
      new: true,
      runValidators: validate
    })
    if (!data) throw new AppError(404, `No ${Model.collection.collectionName} found with this id`)

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
