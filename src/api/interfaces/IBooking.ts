export default interface IBooking {
  _id: string
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
