import { v4 as uuidv4 } from 'uuid'
import mongoose, { Schema } from 'mongoose'
import { ISetting } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   SettingResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     minBookingLength:
 *      type: number
 *     maxBookingLength:
 *      type: number
 *     maxGuestsPersonal:
 *      type: number
 *     breakfastPrice:
 *      type: number
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const settingSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => `setting-${uuidv4()}`
      // unique: true
      // required: true,
    },
    minBookingLength: {
      type: Number,
      required: true
    },
    maxBookingLength: {
      type: Number,
      required: true
    },
    maxGuestsPersonal: {
      type: Number,
      required: true
    },
    breakfastPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Setting = mongoose.model<ISetting>('Setting', settingSchema)

export default Setting
