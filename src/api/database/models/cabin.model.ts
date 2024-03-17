import mongoose, { Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { ICabin } from '~/api/interfaces'

/**
 * @openapi
 * components:
 *  schemas:
 *   CabinResponse:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *     name:
 *      type: string
 *     maxCapacity:
 *      type: number
 *     regularPrice:
 *      type: number
 *     discount:
 *      type: number
 *     description:
 *      type: string
 *     image:
 *      type: string
 *     createdAt:
 *      type: string
 *      format: date
 *     updatedAt:
 *      type: string
 *      format: date
 */
const cabinSchema = new Schema(
  {
    _id: {
      type: String,
      // required: true,
      default: `cabin-${uuidv4()}`,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    maxCapacity: {
      type: Number,
      required: true
    },
    regularPrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Cabin = mongoose.model<ICabin>('Cabin', cabinSchema)

export default Cabin
