import { Request, Response } from 'express'

interface Options {
  id?: string
  body?: Omit<any, '_id' | 'createdAt' | 'updatedAt'>
}

type ControllerFn = ({ id, body }: Options) => Promise<{ data: any; collectionName: string }>

const getAll = (fn: ControllerFn) =>
  async function (req: Request, res: Response) {
    const { data, collectionName } = await fn({})

    res.json({
      status: 'success',
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

    res.status(201).json({
      status: 'success',
      data: {
        [collectionName]: data
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

    res.status(204).json({
      status: 'success',
      data: null
    })
  }

export { getAll, getOne, postOne, updateOne, deleteOne }
