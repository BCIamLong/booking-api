export default interface ICabin {
  _id: string
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: string
  createdAt: Date
  updatedAt: Date
}
