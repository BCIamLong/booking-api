jest.mock('../../database/models/cabin.model.ts')
import Cabin from '../../database/models/cabin.model'
import cabinsService from '../cabins.service'

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
      // @ts-ignore
      Cabin.find.mockImplementationOnce(() => [cabinItem])

      const data = await fetchCabins()

      // @ts-ignore
      expect(data).toEqual([cabinItem])
    })
  })

  describe('fetchCabin', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Cabin.findById.mockImplementationOnce(() => undefined)
        try {
          await fetchCabin('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a cabin', async () => {
        // @ts-ignore
        Cabin.findById.mockImplementationOnce(() => cabinItem)

        const data = await fetchCabin('valid_id')
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

        const data = await createCabin(cabinInput)

        expect(data).toEqual(cabinItem)
      })
    })
  })

  describe('editCabin', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Cabin.findByIdAndUpdate.mockImplementationOnce(() => undefined)

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

        const data = await createCabin(cabinInput)

        expect(data).toEqual(cabinItem)
      })
    })
  })

  describe('removeCabin', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Cabin.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          await removeCabin('invalid_id')
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a cabin', async () => {
        // @ts-ignore
        Cabin.findByIdAndDelete.mockImplementationOnce(() => cabinItem)

        const data = await removeCabin('valid_id')
        expect(data).toEqual(undefined)
      })
    })
  })
})
