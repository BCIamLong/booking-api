import { Document } from 'mongoose'

export interface ISettingInput {
  minBookingLength: number
  maxBookingLength: number
  maxGuestsPersonal: number
  breakfastPrice: number
  createdAt: Date
  updatedAt: Date
}

export default interface ISetting extends ISettingInput, Document {
  _id: string
}
