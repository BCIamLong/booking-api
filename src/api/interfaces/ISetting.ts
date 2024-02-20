export default interface ISetting {
  _id: string
  minBookingLength: number
  maxBookingLength: number
  maxGuestsPersonal: number
  breakfastPrice: number
  createdAt: Date
  updatedAt: Date
}
