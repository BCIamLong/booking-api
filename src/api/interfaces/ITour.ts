import { Document } from 'mongoose'

interface StartDate {
  date: Date
  participants: number
  soldOut: boolean
}

interface StartLocation {
  type: string
  coordinates: number[]
  address: string
  description: string
}

interface Location extends StartLocation {
  day: number
}

export interface ITourInput {
  name: string
  slug: string
  duration: number
  maxGroupSize: number
  difficulty: string
  type: string
  ratingsAverage: number
  ratingsQuantity: number
  summary: string
  description: string
  price: number
  imageCover: string
  images: string[]
  createdAt: Date
  updatedAt: Date
  startDates: StartDate[]
  vip: boolean
  startLocation: StartLocation
  locations: Location[]
}

export default interface ITour extends ITourInput, Document {
  _id: string
}
