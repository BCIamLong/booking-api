import { Request, Response } from 'express'
import { cabinsService } from '../services'

const { fetchCabins, fetchCabin, editCabin, createCabin, removeCabin } = cabinsService

const getCabins = async function (req: Request, res: Response) {
  const cabins = await fetchCabins()

  res.json({
    status: 'success',
    data: {
      cabins
    }
  })
}
const getCabin = async function (req: Request, res: Response) {
  const cabin = await fetchCabin(req.params.id)

  res.json({
    status: 'success',
    data: {
      cabin
    }
  })
}
const postCabin = async function (req: Request, res: Response) {
  const cabin = await createCabin(req.body)

  res.status(201)
  res.json({
    status: 'success',
    data: {
      cabin
    }
  })
}
const updateCabin = async function (req: Request, res: Response) {
  const cabin = await editCabin(req.params.id, req.body)

  res.json({
    status: 'success',
    data: {
      cabin
    }
  })
}
const deleteCabin = async function (req: Request, res: Response) {
  await removeCabin(req.params.id)

  res.status(204)
  res.json({
    status: 'success',
    data: null
  })
}

export default { getCabins, getCabin, postCabin, updateCabin, deleteCabin }
