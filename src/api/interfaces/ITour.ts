import { Document } from 'mongoose'

export interface StartDate {
  _id?: string
  date: Date
  participants?: number
  soldOut?: boolean
}

export interface StartLocation {
  type?: string
  coordinates: number[]
  address: string
  description: string
}

export interface Location extends StartLocation {
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
