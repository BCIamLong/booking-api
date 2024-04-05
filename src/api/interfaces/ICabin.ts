import { Document } from 'mongoose'

export interface ICabinInput {
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: string
  createdAt: Date
  updatedAt: Date
}

export default interface ICabin extends ICabinInput, Document {
  _id: string
}
