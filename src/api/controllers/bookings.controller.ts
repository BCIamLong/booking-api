import { Request, Response } from 'express'
import { Stripe } from 'stripe'
import { bookingsService, cabinsService } from '../services'
import { deleteOne, getAll, getOne, postOne, updateOne } from './factory.controller'
import { paymentConfig, appConfig } from '~/config'
import { AppError } from '../utils'
import { IBooking, ICabin, IGuest, IUser } from '../interfaces'

const { stripe } = paymentConfig
const { CLIENT_ORIGIN, appEmitter } = appConfig
const { fetchCabin } = cabinsService
const { fetchBookings, fetchBooking, editBooking, createBooking, removeBooking, removeUserBooking } = bookingsService

const getBookings = getAll(async (options) => {
  const { data, collectionName, count } = await fetchBookings(options.queryStr)
  return { data, collectionName, count }
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
  const { data, collectionName } = await removeBooking(options)
  // const { data, collectionName } = await removeBooking(options.id || '')

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
  const { cabinId } = req.params
  const queryOb: { guestId: string; sort: string; cabinId?: string } = { guestId: req.user.id, sort: '-createdAt' }
  if (cabinId) queryOb.cabinId = cabinId

  const { data: userBookings } = await fetchBookings(queryOb)

  res.json({
    status: 'success',
    bookings: userBookings
  })
}

const createBookingCheckout = async function (req: Request, res: Response) {
  const { user, cabin, price, endDate, startDate, numGuests, numNights } = req.query
  if (!user || !cabin || !price || !startDate || !endDate || !numGuests || !numNights)
    throw new AppError(400, 'Purchase process is failed')
  const { data: cabinData } = await fetchCabin(cabin as string)
  const { regularPrice } = cabinData
  const { data: booking } = await createBooking({
    cabinId: cabin as string,
    guestId: user as string,
    startDate: new Date(startDate as string),
    endDate: new Date(endDate as string),
    numNights: +numNights,
    numGuests: +numGuests,
    cabinPrice: regularPrice,
    extrasPrice: 0,
    totalPrice: +price!,
    observation: 'I will checking later',
    status: 'confirmed'
  })
  const url = `${CLIENT_ORIGIN}/profile/bookings`
  const customBooking = { ...booking, totalPrice: +price, cabinId: { name: cabinData.name } } as IBooking & {
    cabinId: string | ICabin
  }

  appEmitter.bookingSuccess(req.user as IUser & IGuest, customBooking, url)

  res.redirect(`${CLIENT_ORIGIN}/bookings/success`)
}

const getCheckOutSession = async function (req: Request, res: Response) {
  const { cabinId, cabinName, regularPrice, name, description, image, endDate, startDate, numGuests, numNights } =
    req.body
  // console.log(req.user)
  const { id: userId, email } = req.user

  // const imageCustom = image?.startsWith('cabin-') ? `${CLIENT_ORIGIN}/imgs/cabins/${image}` : image
  const imageCustom = image?.startsWith('cabin-') ? `${req.protocol}://${req.get('host')}/imgs/cabins/${image}` : image
  // console.log(`${req.protocol}://${req.get('host')}/imgs/cabins/${image}`)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    // * the comment bellow use for in development
    // success_url: `${req.protocol}://${req.get('host')}/api/v1/bookings/create-booking-checkout?user=${userId}&cabin=${cabinId}&price=${regularPrice}&startDate=${startDate}&endDate=${endDate}&numGuests=${numGuests}&numNights=${numNights}`,

    success_url: `${CLIENT_ORIGIN}/bookings/success`, //* for production

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
    ],
    // * this is the way we can custom the data we want to pass to session
    // * and we use it when we deploy because now we can use webhook from stripe
    // * for production
    metadata: {
      user: userId,
      cabinName,
      startDate,
      endDate,
      numGuests,
      numNights,
      extrasPrice: 0,
      observation: 'I will checking later'
    }
  })
  // res.redirect(303, session.url as string)
  res.status(201).json({
    status: 'success',
    redirectUrl: session.url
    // session
  })
}

const createBookingWebhookCheckout = async function (session: Stripe.Checkout.Session, userData: IUser & IGuest) {
  const { client_reference_id, metadata, line_items } = session || {}
  const { user, startDate, endDate, numGuests, numNights, extrasPrice, observation, cabinName } = metadata || {}
  const cabinId = client_reference_id as string
  // const price = line_items?.[0].price_data.unit_amount
  const price = line_items?.data[0].price?.unit_amount as number

  const { data: booking } = await createBooking({
    cabinId,
    guestId: user as string,
    startDate: new Date(startDate as string),
    endDate: new Date(endDate as string),
    numNights: +numNights,
    numGuests: +numGuests,
    cabinPrice: price,
    extrasPrice: +extrasPrice,
    totalPrice: price + +extrasPrice,
    observation,
    status: 'confirmed'
  })

  const customBooking = { ...booking, totalPrice: +price, cabinId: { name: cabinName } } as IBooking & {
    cabinId: string | ICabin
  }
  const url = `${CLIENT_ORIGIN}/profile/bookings`

  appEmitter.bookingSuccess(userData as IUser & IGuest, customBooking, url)
}

const webhookCheckout = async function (req: Request, res: Response) {
  const signature = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature!, process.env.STRIPE_WEBHOOK_CHECKOUT_SECRET!)
  } catch (err: any) {
    return res.status(400).send(`Webhook error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed')
    createBookingWebhookCheckout(event.data.object, req.user as IUser & IGuest)

  res.status(200).json({ received: true })
}

// const webhookCheckout = async function (req: Request, res: Response) {
//   const signature = req.headers['stripe-signature']

//   let event

//   try {
//     event = stripe.webhooks.constructEvent(req.body, signature!, process.env.STRIPE_WEBHOOK_CHECKOUT_SECRET!)
//   } catch (err: any) {
//     return res.status(400).send(`Webhook error: ${err.message}`)
//   }

//   if (event.type === 'checkout.session.completed') {
//     const { client_reference_id, metadata, line_items } = event.data.object || {}
//     const { user, startDate, endDate, numGuests, numNights, extrasPrice, observation, cabinName } = metadata || {}
//     const cabinId = client_reference_id as string
//     // const price = line_items?.[0].price_data.unit_amount
//     const price = line_items?.data[0].price?.unit_amount as number

//     const { data: booking } = await createBooking({
//       cabinId,
//       guestId: user as string,
//       startDate: new Date(startDate as string),
//       endDate: new Date(endDate as string),
//       numNights: +numNights,
//       numGuests: +numGuests,
//       cabinPrice: price,
//       extrasPrice: +extrasPrice,
//       totalPrice: price + +extrasPrice,
//       observation,
//       status: 'confirmed'
//     })

//     const customBooking = { ...booking, totalPrice: +price, cabinId: { name: cabinName } } as IBooking & {
//       cabinId: string | ICabin
//     }
//     const url = `${CLIENT_ORIGIN}/profile/bookings`

//     appEmitter.bookingSuccess(req.user as IUser & IGuest, customBooking, url)
//   }

//   res.status(200).json({ received: true })
// }

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
  deleteUserBooking,
  webhookCheckout
}
