import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateBookingInput:
 *    type: object
 *    required:
 *     - cabinId
 *     - guestId
 *     - startDate
 *     - endDate
 *     - numNights
 *     - numGuests
 *     - cabinPrice
 *     - extrasPrice
 *     - totalPrice
 *     - observation
 *    properties:
 *     cabinId:
 *      type: string
 *      default: cabin1
 *     guestId:
 *      type: string
 *      default: ed73d063-c778-40d3-8e4c-6f2d45b4a931
 *     startDate:
 *      type: string
 *      format: date
 *     endDate:
 *      type: string
 *      format: date
 *     numNights:
 *      type: number
 *      default: 4
 *     numGuests:
 *      type: number
 *      default: 2
 *     cabinPrice:
 *      type: number
 *      default: 200
 *     extrasPrice:
 *      type: number
 *      default: 50
 *     totalPrice:
 *      type: number
 *      default: 250
 *     status:
 *      type: string
 *      default: confirmed
 *     hasBreakfast:
 *      type: boolean
 *      default: false
 *     isPaid:
 *      type: boolean
 *      default: false
 *     observation:
 *      type: string
 *      default: Guests prefer a quiet cabin
 */
const createBookingSchema = Joi.object({
  cabinId: Joi.string().required(),
  guestId: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  numNights: Joi.number().required().strict(true),
  numGuests: Joi.number().required().strict(true),
  cabinPrice: Joi.number().required().strict(true),
  extrasPrice: Joi.number().required().strict(true),
  totalPrice: Joi.number().required().strict(true),
  status: Joi.string().valid('unconfirmed', 'checked-in', 'checked-out'),
  hasBreakfast: Joi.boolean(),
  isPaid: Joi.boolean(),
  observation: Joi.string().required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateBookingInput:
 *    type: object
 *    properties:
 *     cabinId:
 *      type: string
 *      default: cabin1
 *     guestId:
 *      type: string
 *      default: guest1
 *     startDate:
 *      type: string
 *      format: date
 *     endDate:
 *      type: string
 *      format: date
 *     numNights:
 *      type: number
 *      default: 4
 *     numGuests:
 *      type: number
 *      default: 2
 *     cabinPrice:
 *      type: number
 *      default: 200
 *     extrasPrice:
 *      type: number
 *      default: 50
 *     totalPrice:
 *      type: number
 *      default: 250
 *     status:
 *      type: string
 *      default: confirmed
 *     hasBreakfast:
 *      type: boolean
 *      default: false
 *     isPaid:
 *      type: boolean
 *      default: false
 *     observation:
 *      type: string
 *      default: Guests prefer a quiet cabin
 */
const updateBookingSchema = Joi.object({
  cabinId: Joi.string(),
  guestId: Joi.string(),
  startDate: Joi.date(),
  endDate: Joi.date(),
  numNights: Joi.number().strict(true),
  numGuests: Joi.number().strict(true),
  cabinPrice: Joi.number().strict(true),
  extrasPrice: Joi.number().strict(true),
  totalPrice: Joi.number().strict(true),
  status: Joi.string(),
  hasBreakfast: Joi.boolean(),
  isPaid: Joi.boolean(),
  observation: Joi.string()
})

export default { createBookingSchema, updateBookingSchema }
