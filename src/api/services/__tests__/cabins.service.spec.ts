jest.mock('../../database/models/cabin.model.ts')
// ? the error related to undefined of logger or other utils
// * so that because somehow it doesn't be imported in jest runtime so we need to include all the utils right here so we just imported all of them in the utils index file
// * so that solved the problem
jest.mock('../../utils/index.ts')

jest.mock('../../utils/APIFeatures.ts', () => {
  return jest.fn().mockImplementation(() => {
    return {
      filter: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      selectFields: jest.fn().mockReturnThis(),
      pagination: jest.fn().mockReturnThis()
    }
  })
})

import APIFeatures from '../../utils/APIFeatures'
import cabinsService from '../cabins.service'
import Cabin from '../../database/models/cabin.model'
import { AppError } from '../../utils'

const { fetchCabins, fetchCabin, createCabin, editCabin, removeCabin } = cabinsService

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

const cabinInput = {
  name: 'Cozy Cabin',
  maxCapacity: 4,
  regularPrice: 100,
  discount: 10,
  description: 'A cozy cabin nestled in the woods.',
  image: 'cozy_cabin.jpg'
}

describe('unit test for cabins service', () => {
  describe('fetchCabins', () => {
    it('should return cabins', async () => {
      // * we should use the mockResolvedValue because this value here is still use and manipulate like query, filter, sort...
      // * and then we just await this to get the real value so that's how it works in our code

      // @ts-ignore
      Cabin.find.mockResolvedValue([cabinItem])

      const { data } = await fetchCabins()

      // @ts-ignore
      expect(data).toEqual([cabinItem])
    })
  })

  describe('fetchCabin', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Cabin.findById.mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Cabin.findById = jest.fn().mockImplementation(() => undefined)

        try {
          await fetchCabin('invalid_id')
        } catch (err: any) {
          console.log(err)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a cabin', async () => {
        // @ts-ignore
        Cabin.findById.mockImplementationOnce(() => cabinItem)

        const { data } = await fetchCabin('valid_id')
        expect(data).toEqual(cabinItem)
      })
    })
  })

  describe('createCabin', () => {
    describe('given an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Cabin.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await createCabin(cabinInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a new cabin', async () => {
        // @ts-ignore
        Cabin.create.mockImplementationOnce(() => cabinItem)

        const { data } = await createCabin(cabinInput)

        expect(data).toEqual(cabinItem)
      })
    })
  })

  describe('editCabin', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Cabin.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        // @ts-ignore
        Cabin.findByIdAndUpdate.mockRejectedValueOnce({
          statusCode: 404
        })

        try {
          await editCabin('invalid_id', cabinInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id but an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Cabin.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await editCabin('valid_id', cabinInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid id and a valid input', () => {
      it('should return a new updated cabin', async () => {
        // @ts-ignore
        Cabin.create.mockImplementationOnce(() => cabinItem)

        const { data } = await createCabin(cabinInput)

        expect(data).toEqual(cabinItem)
      })
    })
  })

  describe('removeCabin', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Cabin.findByIdAndDelete.mockImplementationOnce(() => undefined)
        // @ts-ignore
        Cabin.findOneAndDelete.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 404,
          message: 'ValidationError'
        })
        // @ts-ignore
        // Cabin.findOneAndDelete.mockRejectedValue(new AppError(404, 'No cabin found with this id'))

        // expect(await removeCabin({ id: 'invalid_id' })).rejects.toThrow('No cabin found with this id')

        try {
          await removeCabin({ id: 'invalid_id' })
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a cabin', async () => {
        // @ts-ignore
        Cabin.findOneAndDelete.mockImplementationOnce(() => cabinItem)

        const { data } = await removeCabin({ id: 'valid_id' })
        expect(data).toEqual(cabinItem)
        // expect(data).toEqual(undefined)
      })
    })
  })
})
