jest.mock('../../database/models/cabin.model.ts')
jest.mock('../../utils/index.ts')
jest.mock('../../services/cabins.service')

import Cabin from '../../database/models/cabin.model'
import cabinsController from '../cabins.controller'
import cabinsService from '../../services/cabins.service'

const { getCabins, getCabin, postCabin, deleteCabin, updateCabin } = cabinsController

const req = {
  params: {
    id: 123
  },
  body: {}
}

// const res1 = {
//   json: jest.fn((x) => x)
// }

const res = {
  status: jest.fn().mockReturnThis(),
  // status: jest.fn((status: number) => res1),
  json: jest.fn((x) => x)
}
// const res = jest

const cabinItem = {
  _id: '1',
  name: 'Cozy Cabin',
  maxCapacity: 4,
  regularPrice: 100,
  discount: 10,
  description: 'A cozy cabin nestled in the woods.',
  image: 'cozy_cabin.jpg',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('unit test for cabins controller', () => {
  describe('test getCabins function', () => {
    it('should return a status of 200 and cabins list', async () => {
      // @ts-ignore
      // Cabin.find.mockResolvedValue([cabinItem])
      // Cabin.find.mockImplementationOnce(() => [cabinItem])

      jest.spyOn(cabinsService, 'fetchCabins').mockImplementationOnce(() => ({
        data: [cabinItem],
        collectionName: 'cabins',
        count: 1
      }))

      // @ts-ignore
      await getCabins(req, res)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Object),
        count: 1,
        results: 1
      })
    })
  })

  describe('test getCabin function', () => {
    describe('given an invalid cabin id ', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(cabinsService, 'fetchCabin').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Cabin.findById.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await getCabin(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given an valid cabin id ', () => {
      it('should return a status of 200 and cabin', async () => {
        // @ts-ignore
        // Cabin.findById.mockImplementationOnce(() => cabinItem)
        jest.spyOn(cabinsService, 'fetchCabin').mockImplementationOnce(() => ({
          data: cabinItem,
          collectionName: 'cabins'
        }))

        // @ts-ignore
        await getCabin(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            cabin: cabinItem
          }
        })
      })
    })
  })

  describe('test updateCabin function', () => {
    describe('given the invalid cabin id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(cabinsService, 'editCabin').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Cabin.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await updateCabin(req, res)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
          expect(res.json).toHaveBeenCalledTimes(0)
        }
      })
    })

    describe('given the invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(cabinsService, 'editCabin').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        // @ts-ignore
        // Cabin.findByIdAndUpdate.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await updateCabin(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a status of 200 and new updated cabin', async () => {
        // @ts-ignore
        jest.spyOn(cabinsService, 'editCabin').mockImplementationOnce(() => ({
          data: cabinItem,
          collectionName: 'cabins'
        }))

        // @ts-ignore
        // Cabin.findByIdAndUpdate.mockImplementationOnce(() => cabinItem)

        // @ts-ignore
        await updateCabin(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            cabin: cabinItem
          }
        })
      })
    })
  })

  describe('test postCabin function', () => {
    describe('given an invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(cabinsService, 'createCabin').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // @ts-ignore
        // Cabin.create.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await postCabin(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a status of 201 and new cabin', async () => {
        // @ts-ignore
        jest.spyOn(cabinsService, 'createCabin').mockImplementationOnce(() => ({
          data: cabinItem,
          collectionName: 'cabins'
        }))
        // @ts-ignore
        // Cabin.create.mockImplementationOnce(() => cabinItem)

        // @ts-ignore
        await postCabin(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            // cabin: expect.any(Object)
            cabin: cabinItem
          }
        })
      })
    })
  })

  describe('test deleteCabin function', () => {
    describe('given an invalid id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(cabinsService, 'removeCabin').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Cabin.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          // @ts-ignore
          await deleteCabin(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a status of 204', async () => {
        // @ts-ignore
        jest.spyOn(cabinsService, 'removeCabin').mockImplementationOnce(() => ({
          data: cabinItem,
          collectionName: 'cabins'
        }))
        // Cabin.findByIdAndDelete.mockImplementationOnce(() => cabinItem)

        // @ts-ignore
        await deleteCabin(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null })
      })
    })
  })
})
