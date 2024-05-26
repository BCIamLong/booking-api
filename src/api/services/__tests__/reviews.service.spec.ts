jest.mock('../../database/models/review.model.ts')
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
import reviewsService from '../reviews.service'
import Review from '../../database/models/review.model'
import { AppError } from '../../utils'

const { fetchReviews, fetchReview, createReview, editReview, removeReview } = reviewsService

const reviewItem = {
  _id: 'abc123',
  user: 'user123',
  cabin: 'cabin456',
  review:
    'This cabin was absolutely amazing! The view was stunning and the amenities were top-notch. Highly recommend!',
  rating: 5,
  createdAt: new Date(),
  updatedAt: new Date()
}

const reviewInput = {
  user: 'user123',
  cabin: 'cabin456',
  review:
    'This cabin was absolutely amazing! The view was stunning and the amenities were top-notch. Highly recommend!',
  rating: 5
}

describe('unit test for reviews service', () => {
  describe('fetchReviews', () => {
    it('should return reviews', async () => {
      // * we should use the mockResolvedValue because this value here is still use and manipulate like query, filter, sort...
      // * and then we just await this to get the real value so that's how it works in our code

      // @ts-ignore
      Review.find.mockResolvedValue([reviewItem])

      const { data } = await fetchReviews()

      // @ts-ignore
      expect(data).toEqual([reviewItem])
    })
  })

  describe('fetchReview', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        Review.findById.mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Review.findById = jest.fn().mockImplementation(() => undefined)

        try {
          await fetchReview('invalid_id')
        } catch (err: any) {
          console.log(err)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a review', async () => {
        // @ts-ignore
        Review.findById.mockImplementationOnce(() => reviewItem)

        const { data } = await fetchReview('valid_id')
        expect(data).toEqual(reviewItem)
      })
    })
  })

  describe('createReview', () => {
    describe('given an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Review.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await createReview(reviewInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a new review', async () => {
        // @ts-ignore
        Review.create.mockImplementationOnce(() => reviewItem)

        const { data } = await createReview(reviewInput)

        expect(data).toEqual(reviewItem)
      })
    })
  })

  describe('editReview', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Review.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        // @ts-ignore
        Review.findByIdAndUpdate.mockRejectedValueOnce({
          statusCode: 404
        })

        try {
          await editReview('invalid_id', reviewInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id but an invalid input', () => {
      it('should throw an error with status code of 400', async () => {
        // @ts-ignore
        Review.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          await editReview('valid_id', reviewInput)
        } catch (err: any) {
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid id and a valid input', () => {
      it('should return a new updated review', async () => {
        // @ts-ignore
        Review.create.mockImplementationOnce(() => reviewItem)

        const { data } = await createReview(reviewInput)

        expect(data).toEqual(reviewItem)
      })
    })
  })

  describe('removeReview', () => {
    describe('given an invalid id', () => {
      it('should throw an error with status code of 404', async () => {
        // @ts-ignore
        // Review.findByIdAndDelete.mockImplementationOnce(() => undefined)
        // @ts-ignore
        Review.findOneAndDelete.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 404,
          message: 'ValidationError'
        })
        // @ts-ignore
        // Review.findOneAndDelete.mockRejectedValue(new AppError(404, 'No review found with this id'))

        // expect(await removeReview({ id: 'invalid_id' })).rejects.toThrow('No review found with this id')

        try {
          await removeReview({ id: 'invalid_id' })
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should delete review and return the review', async () => {
        // @ts-ignore
        Review.findOneAndDelete.mockImplementationOnce(() => reviewItem)

        const { data } = await removeReview({ id: 'valid_id' })
        expect(data).toEqual(reviewItem)
        // expect(data).toEqual(undefined)
      })
    })
  })
})
