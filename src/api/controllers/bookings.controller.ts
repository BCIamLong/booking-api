import { Request, Response } from 'express'
import { bookingsService, cabinsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'
import { paymentConfig, appConfig } from '~/config'
import { AppError } from '../utils'
import { IBooking, ICabin, IGuest, IUser } from '../interfaces'

const { stripe } = paymentConfig
const { CLIENT_ORIGIN, appEmitter } = appConfig
const { fetchCabin } = cabinsService
const { fetchBookings, fetchBooking, editBooking, createBooking, removeBooking, removeUserBooking } = bookingsService

const getBookings = getAll(async () => {
  const { data, collectionName } = await fetchBookings()
  return { data, collectionName }
})
const getBooking = getOne(async (options) => {
  const { data, collectionName } = await fetchBooking(options.id || '')
  return { data, collectionName }
})
const postBooking = postOne(async (options) => {
  const { data, collectionName } = await createBooking(options.body || {})

  return { data, collectionName }
})
const updateBooking = updateOne(async (options) => {
  const { data, collectionName } = await editBooking(options.id || '', options.body || {})

  return { data, collectionName }
})
const deleteBooking = deleteOne(async (options) => {
  const { data, collectionName } = await removeBooking(options.id || '')

  return { data, collectionName }
})

const deleteUserBooking = async function (req: Request, res: Response) {
  const booking = await removeUserBooking({ bookingId: req.params.id, guestId: req.user.id })
  res.status(204).json({
    status: 'success',
    data: {
      booking
    }
  })
}

const getUserBooking = async function (req: Request, res: Response) {
  // console.log(req.user.id)
  const { data: userBookings } = await fetchBookings({ guestId: req.user.id, sort: '-createdAt' })
  // console.log(userBookings)

  res.json({
    status: 'success',
    booking: userBookings[0]
  })
}

const getUserBookings = async function (req: Request, res: Response) {
  const { data: userBookings } = await fetchBookings({ guestId: req.user.id, sort: '-createdAt' })

  res.json({
    status: 'success',
    bookings: userBookings
  })
}

const createBookingCheckout = async function (req: Request, res: Response) {
  const { user, cabin, price } = req.query
  if (!user || !cabin || !price) throw new AppError(400, 'Purchase process is failed')
  const { data: cabinData } = await fetchCabin(cabin as string)
  const { data: booking } = await createBooking({
    cabinId: cabin as string,
    guestId: user as string,
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    numNights: 3,
    numGuests: 3,
    cabinPrice: +price!,
    extrasPrice: 0,
    totalPrice: +price!,
    observation: 'I will checking later',
    status: 'checked-in'
  })
  const url = `${CLIENT_ORIGIN}/profile/bookings`
  const customBooking = { ...booking, totalPrice: +price, cabinId: { name: cabinData.name } } as IBooking & {
    cabinId: string | ICabin
  }

  appEmitter.bookingSuccess(req.user as IUser & IGuest, customBooking, url)

  res.redirect(`${CLIENT_ORIGIN}/bookings/success`)
}

const getCheckOutSession = async function (req: Request, res: Response) {
  const { cabinId, regularPrice, name, description, image } = req.body
  // console.log(req.user)
  const { id: userId, email } = req.user

  // const imageCustom = image?.startsWith('cabin-') ? `${CLIENT_ORIGIN}/imgs/cabins/${image}` : image
  const imageCustom = image?.startsWith('cabin-') ? `${req.protocol}://${req.get('host')}/imgs/cabins/${image}` : image
  // console.log(`${req.protocol}://${req.get('host')}/imgs/cabins/${image}`)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/create-booking-checkout?user=${userId}&cabin=${cabinId}&price=${regularPrice}`,
    cancel_url: `${CLIENT_ORIGIN}/cabins/${cabinId}`,
    customer_email: email,
    client_reference_id: cabinId,

    line_items: [
      {
        price_data: {
          unit_amount: regularPrice * 100, //* 1 $ = 100 cents
          currency: 'usd',
          product_data: {
            name: `${name} Cabin`,
            description,
            images: [imageCustom]
          }
        },
        quantity: 1
      }
    ]
  })
  // res.redirect(303, session.url as string)
  res.json({
    status: 'success',
    redirectUrl: session.url
    // session
  })
}
// const getCheckOutSession = async function (req: Request, res: Response) {
//   const { cabinId: id } = req.params || {}

//   const { data: cabin } = await fetchCabin(id)
//   const { _id: cabinId, regularPrice, name, description, image } = cabin
//   // console.log(req.user)
//   const { id: userId, email } = req.user

//   const imageCustom = image?.startsWith('cabin-') ? `${req.protocol}://${req.get('host')}/imgs/cabins/${image}` : image

//   const session = stripe.checkout.sessions.create({
//     mode: 'payment',
//     payment_method_types: ['card'],
//     success_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/create-booking-checkout?user=${userId}&cabin=${cabinId}&price=${regularPrice}`,
//     cancel_url: `${CLIENT_ORIGIN}/cabins`,
//     customer_email: email,
//     client_reference_id: cabinId,

//     line_items: [
//       {
//         price_data: {
//           unit_amount: regularPrice * 100, //* 1 $ = 100 cents
//           currency: 'usd',
//           product_data: {
//             name: `${name} Cabin`,
//             description,
//             images: [imageCustom]
//           }
//         },
//         quantity: 1
//       }
//     ]
//   })

//   res.json({
//     status: 'success',
//     session
//   })
// }

export default {
  getBookings,
  getBooking,
  postBooking,
  updateBooking,
  deleteBooking,
  getCheckOutSession,
  createBookingCheckout,
  getUserBookings,
  getUserBooking,
  deleteUserBooking
}
