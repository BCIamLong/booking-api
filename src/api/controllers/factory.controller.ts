import { Request, Response } from 'express'
import { QueryStr } from '../utils/APIFeatures'

interface Options {
  id?: string
  body?: any
  queryStr?: QueryStr
}

type ControllerFn = ({ id, body }: Options) => Promise<{ data: any; collectionName: string }>

const getAll = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const { data, collectionName } = await fn({ queryStr: req.query })

    res.json({
      status: 'success',
      results: data.length,
      data: {
        [collectionName]: data
      }
    })
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
    const { data, collectionName } = await fn({ id: req.params.id })

    const formatCollectionName = collectionName.slice(0, collectionName.length - 1)

    res.status(204)
    res.json({
      status: 'success',
      data: null
    })
  }

export { getAll, getOne, postOne, updateOne, deleteOne }
