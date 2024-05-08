import { Query, Model } from 'mongoose'

import AppError from './AppError'
import redis from '../database/redis'
import { appConfig } from '~/config'

const { getCache, setCache } = redis
const { PAGE_LIMIT } = appConfig

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
    public queryStr: any = {}
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
    queryObStr = queryObStr.replace(/(gt|lt|gte|gt|ne)/g, (val) => `$${val}`)

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

  async pagination(count: number) {
    const limitVal = Number(this.queryStr.limit) || PAGE_LIMIT
    const pageVal = Number(this.queryStr.page) || 1
    const skipVal = (pageVal - 1) * limitVal
    const totalPage = Math.ceil(count / limitVal) || 1

    if (pageVal > totalPage) throw new AppError(404, 'The page you looking for is not found!')

    // * 1 check the data is cached in the cache?
    // * 2 if true then just get the data from the cache based on the current page and return it
    // * 3 if false loop and fetch data of all pages then store it to the cache (each page), then return the data from the current page
    // * 4 promise this data
    // console.log(this.query.model)
    const dataCached = await getCache({ hashKey: 'page', key: `${pageVal}-${this.queryStr}`, model: this.query.model })

    if (dataCached) {
      console.log('ok')
      this.query = Promise.resolve(dataCached) as Query<T[], T>
      return this
    }
    // console.log(dataCached)

    const data = await this.query.limit(limitVal).skip(skipVal)

    setCache(String(pageVal), 'page', JSON.stringify(data))
    this.query = Promise.resolve(data) as Query<T[], T>

    // if (pageVal <= totalPage) this.query = this.query.limit(limitVal).skip(skipVal)
    // else throw new AppError(404, 'The page you looking for is not found!')

    // return this
    return this
  }
}
