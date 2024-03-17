import { Request, Response } from 'express'
import { guestsService } from '../services'

const { fetchGuests, fetchGuest, editGuest, createGuest, removeGuest } = guestsService

const getGuests = async function (req: Request, res: Response) {
  const guests = await fetchGuests()

  res.json({
    status: 'success',
    data: {
      guests
    }
  })
}
const getGuest = async function (req: Request, res: Response) {
  const guest = await fetchGuest(req.params.id)

  res.json({
    status: 'success',
    data: {
      guest
    }
  })
}
const postGuest = async function (req: Request, res: Response) {
  const guest = await createGuest(req.body)

  res.status(201)
  res.json({
    status: 'success',
    data: {
      guest
    }
  })
}
const updateGuest = async function (req: Request, res: Response) {
  const guest = await editGuest(req.params.id, req.body)

  res.json({
    status: 'success',
    data: {
      guest
    }
  })
}
const deleteGuest = async function (req: Request, res: Response) {
  await removeGuest(req.params.id)

  res.status(204)
  res.json({
    status: 'success',
    data: null
  })
}

export default { getGuests, getGuest, postGuest, updateGuest, deleteGuest }
