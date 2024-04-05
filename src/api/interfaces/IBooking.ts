import { Document } from 'mongoose'

export interface IBookingInput {
  cabinId: string
  guestId: string
  startDate: Date
  endDate: Date
  numNights: number
  numGuests: number
  cabinPrice: number
  extrasPrice: number
  totalPrice: number
  status?: string
  hasBreakfast?: boolean
  isPaid?: boolean
  observation: string
  createdAt: Date
  updatedAt: Date
}

export default interface IBooking extends IBookingInput, Document {
  _id: string
}
