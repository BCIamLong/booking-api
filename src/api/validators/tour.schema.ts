import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *   CreateTourInput:
 *    type: object
 *    required:
 *     - name
 *     - description
 *     - duration
 *     - maxGroupSize
 *     - difficulty
 *     - type
 *     - summary
 *     - price
 *     - imageCover
 *     - images
 *     - startDates
 *     - startLocation
 *     - locations
 *    properties:
 *     name:
 *      type: string
 *      default: Adventure Tour
 *     description:
 *      type: string
 *      default: An exciting adventure through stunning landscapes.
 *     duration:
 *      type: number
 *      minimum: 0
 *      maximum: 100
 *      default: 7
 *     maxGroupSize:
 *      type: number
 *      minimum: 0
 *      maximum: 100
 *      default: 10
 *     difficulty:
 *      type: string
 *      default: medium
 *     type:
 *      type: string
 *      default: adventure
 *     summary:
 *      type: string
 *      default: A breathtaking week-long adventure tour.
 *     price:
 *      type: number
 *      minimum: 0
 *      default: 500
 *     imageCover:
 *      type: string
 *      default: adventure_tour_cover.jpg
 *     images:
 *      type: array
 *      items:
 *       type: string
 *      default:
 *       - tour_image1.jpg
 *       - tour_image2.jpg
 *     startDates:
 *      type: array
 *      items:
 *       type: object
 *       required:
 *        - date
 *        - participants
 *        - soldOut
 *       properties:
 *        date:
 *         type: string
 *         default: 2025-06-01
 *        participants:
 *         type: number
 *         minimum: 0
 *         default: 5
 *        soldOut:
 *         type: boolean
 *         default: false
 *     startLocation:
 *      type: object
 *      required:
 *       - coordinates
 *       - address
 *       - description
 *      properties:
 *       type:
 *        type: string
 *        default: Point
 *       coordinates:
 *        type: array
 *        items:
 *         type: number
 *        default: [102.0, 0.5]
 *       address:
 *        type: string
 *        default: 123 Adventure Road, Colorado
 *       description:
 *        type: string
 *        default: Starting point of the adventure tour.
 *     locations:
 *      type: array
 *      items:
 *       type: object
 *       required:
 *        - coordinates
 *        - address
 *        - day
 *        - description
 *       properties:
 *        type:
 *         type: string
 *         default: Point
 *        coordinates:
 *         type: array
 *         items:
 *          type: number
 *         default: [102.0, 0.5]
 *        address:
 *         type: string
 *         default: 456 Scenic Lane, Utah
 *        day:
 *         type: number
 *         default: 3
 *        description:
 *         type: string
 *         default: Stop at a breathtaking scenic viewpoint.
 */
const createTourSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.number().min(0).max(100).required(),
  maxGroupSize: Joi.number().min(0).max(100).required(),
  difficulty: Joi.string().required(),
  type: Joi.string().required(),
  summary: Joi.string().required(),
  price: Joi.number().min(0).required(),
  imageCover: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
  startDates: Joi.array()
    .items(
      Joi.object({
        date: Joi.string().required(),
        participants: Joi.number().min(0).required(),
        soldOut: Joi.boolean().required()
      })
    )
    .required(),
  startLocation: Joi.object({
    type: Joi.string(),
    coordinates: Joi.array().required(),
    address: Joi.string().required(),
    description: Joi.string().required()
  }).required(),
  locations: Joi.array()
    .items(
      Joi.object({
        type: Joi.string(),
        coordinates: Joi.array().required(),
        address: Joi.string().required(),
        day: Joi.number().required(),
        description: Joi.string().required()
      })
    )
    .required()
})

/**
 * @openapi
 * components:
 *  schemas:
 *   UpdateTourInput:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      default: Adventure Tour
 *     description:
 *      type: string
 *      default: An exciting adventure through stunning landscapes.
 *     duration:
 *      type: number
 *      minimum: 0
 *      maximum: 100
 *      default: 7
 *     maxGroupSize:
 *      type: number
 *      minimum: 0
 *      maximum: 100
 *      default: 10
 *     difficulty:
 *      type: string
 *      default: medium
 *     type:
 *      type: string
 *      default: adventure
 *     summary:
 *      type: string
 *      default: A breathtaking week-long adventure tour.
 *     price:
 *      type: number
 *      minimum: 0
 *      default: 500
 *     imageCover:
 *      type: string
 *      default: adventure_tour_cover.jpg
 *     images:
 *      type: array
 *      items:
 *       type: string
 *      default:
 *       - tour_image1.jpg
 *       - tour_image2.jpg
 *     startDates:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        date:
 *         type: string
 *         default: 2025-06-01
 *        participants:
 *         type: number
 *         minimum: 0
 *         default: 5
 *        soldOut:
 *         type: boolean
 *         default: false
 *     startLocation:
 *      type: object
 *      properties:
 *       type:
 *        type: string
 *        default: Point
 *       coordinates:
 *        type: array
 *        items:
 *         type: number
 *        default: [102.0, 0.5]
 *       address:
 *        type: string
 *        default: 123 Adventure Road, Colorado
 *       description:
 *        type: string
 *        default: Starting point of the adventure tour.
 *     locations:
 *      type: array
 *      items:
 *       type: object
 *       properties:
 *        type:
 *         type: string
 *         default: Point
 *        coordinates:
 *         type: array
 *         items:
 *          type: number
 *         default: [102.0, 0.5]
 *        address:
 *         type: string
 *         default: 456 Scenic Lane, Utah
 *        day:
 *         type: number
 *         default: 3
 *        description:
 *         type: string
 *         default: Stop at a breathtaking scenic viewpoint.
 */
const updateTourSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  duration: Joi.number().min(0).max(100),
  maxGroupSize: Joi.number().min(0).max(100),
  difficulty: Joi.string(),
  type: Joi.string(),
  summary: Joi.string(),
  price: Joi.number().min(0),
  imageCover: Joi.string(),
  images: Joi.array().items(Joi.string()),
  startDates: Joi.array().items(
    Joi.object({
      date: Joi.string(),
      participants: Joi.number().min(0),
      soldOut: Joi.boolean()
    })
  ),
  startLocation: Joi.object({
    type: Joi.string(),
    coordinates: Joi.array(),
    address: Joi.string(),
    description: Joi.string()
  }),
  locations: Joi.array().items(
    Joi.object({
      type: Joi.string(),
      coordinates: Joi.array(),
      address: Joi.string(),
      day: Joi.number(),
      description: Joi.string()
    })
  )
})

export default { createTourSchema, updateTourSchema }
