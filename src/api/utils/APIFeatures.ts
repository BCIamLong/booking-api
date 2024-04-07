import { Query, Model } from 'mongoose'
import AppError from './AppError'

interface Operations {
  gt?: string
  gte?: string
  lt?: string
  lte?: string
}

export type QueryStr = any

// export interface QueryStr {
//   sort?: string | string[]
//   fields?: string
//   limit?: string
//   page?: string
//   discount?: string | Operations
// }

export default class APIFeatures<T> {
  constructor(
    // *In Query generic type it requires at least two params T[] for result type and T for document type
    public query: Query<T[], T>,
    public queryStr: any
  ) {}
  filter() {
    const operations = ['fields', 'sort', 'limit', 'page']
    // console.log(this.queryStr)
    const queryOb = { ...this.queryStr }

    // * we get query object
    // * remove the operations and only let's the query like as field like price = 123...
    operations.forEach((op) => delete queryOb[op])
    // * then we need to think about the case we have $gte, $gt, $lt, $lte... we have two factor $ and short name of operation: { price: { gte: '2' } } so the query string we get like this, url: price[gte]=2
    // * how we can add the $ to before gte like: $gte
    let queryObStr = JSON.stringify(queryOb)
    queryObStr = queryObStr.replace(/(gt|lt|gte|gt)/g, (val) => `$${val}`)

    // * and put this to the find() method

    this.query = this.query.find(JSON.parse(queryObStr))
    // * return this.query to chaining object
    return this
  }

  sort() {
    const sortVal = this.queryStr.sort
    if (!sortVal) {
      this.query = this.query.sort('-createdAt')
      return this
    }
    // * sort=duration&sort=price => { price: { gte: '2' }, sort: [ 'duration', 'price' ] }
    // * sort=duration => sort: 'price'

    const sortQueryStr = Array.isArray(sortVal) ? sortVal.join(' ') : sortVal
    this.query = this.query.sort(sortQueryStr)
    return this
  }

  selectFields() {
    // *url query: fields=name,age,email,-password: =>  fields: 'name,age,email,-password'
    // * - is remove from the document
    const selectVal = this.queryStr.fields
    if (!selectVal) {
      this.query = this.query.select('-__v')
      return this
    }

    const selectQueryStr = selectVal.split(',').join(' ')
    this.query = this.query.select(selectQueryStr)
    return this
  }

  pagination(count: number) {
    const limitVal = Number(this.queryStr.limit) || 10
    const pageVal = Number(this.queryStr.page) || 1
    const skipVal = (pageVal - 1) * limitVal
    const totalPage = Math.ceil(count / limitVal)

    if (pageVal <= totalPage) this.query = this.query.limit(limitVal).skip(skipVal)
    else throw new AppError(404, 'The page you looking for is not found!')

    return this
  }
}
