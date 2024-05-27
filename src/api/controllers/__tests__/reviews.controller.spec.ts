jest.mock('../../database/models/review.model.ts')
jest.mock('../../utils/index.ts')
jest.mock('../../services/reviews.service')

import Review from '../../database/models/review.model'
import reviewsController from '../review.controller'
import reviewsService from '../../services/reviews.service'

const { getReviews, getReview, postReview, deleteReview, updateReview } = reviewsController

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

describe('unit test for reviews controller', () => {
  describe('test getReviews function', () => {
    it('should return a status of 200 and reviews list', async () => {
      // @ts-ignore
      // Review.find.mockResolvedValue([reviewItem])
      // Review.find.mockImplementationOnce(() => [reviewItem])

      jest.spyOn(reviewsService, 'fetchReviews').mockImplementationOnce(() => ({
        data: [reviewItem],
        collectionName: 'reviews',
        count: 1
      }))

      // @ts-ignore
      await getReviews(req, res)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Object),
        count: 1,
        results: 1
      })
    })
  })

  describe('test getReview function', () => {
    describe('given an invalid review id ', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(reviewsService, 'fetchReview').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Review.findById.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await getReview(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given an valid review id ', () => {
      it('should return a status of 200 and review', async () => {
        // @ts-ignore
        // Review.findById.mockImplementationOnce(() => reviewItem)
        jest.spyOn(reviewsService, 'fetchReview').mockImplementationOnce(() => ({
          data: reviewItem,
          collectionName: 'reviews'
        }))

        // @ts-ignore
        await getReview(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            review: reviewItem
          }
        })
      })
    })
  })

  describe('test updateReview function', () => {
    describe('given the invalid review id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(reviewsService, 'editReview').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Review.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await updateReview(req, res)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
          expect(res.json).toHaveBeenCalledTimes(0)
        }
      })
    })

    describe('given the invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(reviewsService, 'editReview').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        // @ts-ignore
        // Review.findByIdAndUpdate.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await updateReview(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a status of 200 and new updated review', async () => {
        // @ts-ignore
        jest.spyOn(reviewsService, 'editReview').mockImplementationOnce(() => ({
          data: reviewItem,
          collectionName: 'reviews'
        }))

        // @ts-ignore
        // Review.findByIdAndUpdate.mockImplementationOnce(() => reviewItem)

        // @ts-ignore
        await updateReview(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            review: reviewItem
          }
        })
      })
    })
  })

  describe('test postReview function', () => {
    describe('given an invalid input', () => {
      it('should return a status of 400', async () => {
        jest.spyOn(reviewsService, 'createReview').mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })
        // @ts-ignore
        // Review.create.mockRejectedValueOnce({
        //   name: 'ValidationError',
        //   statusCode: 400
        // })

        try {
          // @ts-ignore
          await postReview(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a status of 201 and new review', async () => {
        // @ts-ignore
        jest.spyOn(reviewsService, 'createReview').mockImplementationOnce(() => ({
          data: reviewItem,
          collectionName: 'reviews'
        }))
        // @ts-ignore
        // Review.create.mockImplementationOnce(() => reviewItem)

        // @ts-ignore
        await postReview(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            // review: expect.any(Object)
            review: reviewItem
          }
        })
      })
    })
  })

  describe('test deleteReview function', () => {
    describe('given an invalid id', () => {
      it('should return a status of 404', async () => {
        jest.spyOn(reviewsService, 'removeReview').mockRejectedValueOnce({
          statusCode: 404
        })
        // @ts-ignore
        // Review.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          // @ts-ignore
          await deleteReview(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a status of 204', async () => {
        // @ts-ignore
        jest.spyOn(reviewsService, 'removeReview').mockImplementationOnce(() => ({
          data: reviewItem,
          collectionName: 'reviews'
        }))
        // Review.findByIdAndDelete.mockImplementationOnce(() => reviewItem)

        // @ts-ignore
        await deleteReview(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null })
      })
    })
  })
})
