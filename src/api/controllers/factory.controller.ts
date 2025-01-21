import { Request, Response } from 'express'
import { QueryStr } from '../utils/APIFeatures'

interface Options {
  id?: string
  body?: any
  queryStr?: QueryStr
  num?: number
}

type ControllerFn = ({ id, body }: Options) => Promise<{ data: any; count?: number; collectionName: string }>

const getAll = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    // try {
    const { data, collectionName, count } = await fn({ queryStr: req.query })
    // console.log(count)
    res.json({
      status: 'success',
      count: count,
      results: data.length,
      data: {
        [collectionName]: data
      }
    })
    // } catch (err) {
    //   console.log(err)
    // }
  }

const getOne = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const { data, collectionName } = await fn({ id: req.params.id })
    const formatCollectionName = collectionName.slice(0, collectionName.length - 1)

    res.json({
      status: 'success',
      data: {
        [formatCollectionName]: data
      }
    })
  }

const postOne = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const { data, collectionName } = await fn({ body: req.body })
    const formatCollectionName = collectionName.slice(0, collectionName.length - 1)

    res.status(201)
    res.json({
      status: 'success',
      data: {
        [formatCollectionName]: data
      }
    })
  }

const updateOne = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const { data, collectionName } = await fn({ id: req.params.id, body: req.body })

    const formatCollectionName = collectionName.slice(0, collectionName.length - 1)

    res.json({
      status: 'success',
      data: {
        [formatCollectionName]: data
      }
    })
  }

const deleteOne = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const { data, collectionName } = await fn({ id: req.params.id, queryStr: req.query })

    const formatCollectionName = collectionName.slice(0, collectionName.length - 1)

    res.status(204)
    res.json({
      status: 'success',
      data: null
    })
  }

const getRandom = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const numVal = req.query?.num ? +req.query?.num : 10
    const { data, collectionName } = await fn({ num: numVal as number })

    res.json({
      status: 'success',
      data: {
        [collectionName]: data
      }
    })
  }

export { getAll, getOne, postOne, updateOne, deleteOne, getRandom }
