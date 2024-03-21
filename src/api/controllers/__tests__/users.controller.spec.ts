jest.mock('../../database/models/user.model.ts')
import User from '../../database/models/user.model'
import usersController from '../users.controller'

const { getUsers, getUser, postUser, deleteUser, updateUser } = usersController

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

const userItem = {
  _id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPwd(password123)',
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('unit test for users controller', () => {
  describe('test getUsers function', () => {
    it('should return a status of 200 and users list', async () => {
      // @ts-ignore
      User.find.mockImplementationOnce(() => [userItem])

      // @ts-ignore
      await getUsers(req, res)

      expect(res.json).toHaveBeenCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: expect.any(Object)
      })
    })
  })

  describe('test getUser function', () => {
    describe('given an invalid user id ', () => {
      it('should return a status of 404', async () => {
        // @ts-ignore
        User.findById.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await getUser(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given an valid user id ', () => {
      it('should return a status of 200 and user', async () => {
        // @ts-ignore
        User.findById.mockImplementationOnce(() => userItem)

        // @ts-ignore
        await getUser(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            user: userItem
          }
        })
      })
    })
  })

  describe('test updateUser function', () => {
    describe('given the invalid user id', () => {
      it('should return a status of 404', async () => {
        // @ts-ignore
        User.findByIdAndUpdate.mockImplementationOnce(() => undefined)

        try {
          // @ts-ignore
          await updateUser(req, res)
        } catch (err: any) {
          expect(err.statusCode).toBe(404)
          expect(res.json).toHaveBeenCalledTimes(0)
        }
      })
    })

    describe('given the invalid input', () => {
      it('should return a status of 400', async () => {
        // @ts-ignore
        User.findByIdAndUpdate.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await updateUser(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given the valid input', () => {
      it('should return a status of 200 and new updated user', async () => {
        // @ts-ignore
        User.findByIdAndUpdate.mockImplementationOnce(() => userItem)
        // @ts-ignore
        await updateUser(req, res)

        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            user: userItem
          }
        })
      })
    })
  })

  describe('test postUser function', () => {
    describe('given an invalid input', () => {
      it('should return a status of 400', async () => {
        // @ts-ignore
        User.create.mockRejectedValueOnce({
          name: 'ValidationError',
          statusCode: 400
        })

        try {
          // @ts-ignore
          await postUser(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(400)
        }
      })
    })

    describe('given a valid input', () => {
      it('should return a status of 201 and new user', async () => {
        // @ts-ignore
        User.create.mockImplementationOnce(() => userItem)
        // @ts-ignore
        await postUser(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            // user: expect.any(Object)
            user: userItem
          }
        })
      })
    })
  })

  describe('test deleteUser function', () => {
    describe('given an invalid id', () => {
      it('should return a status of 404', async () => {
        // @ts-ignore
        User.findByIdAndDelete.mockImplementationOnce(() => undefined)
        try {
          // @ts-ignore
          await deleteUser(req, res)
        } catch (err: any) {
          expect(res.json).toHaveBeenCalledTimes(0)
          expect(err.statusCode).toBe(404)
        }
      })
    })

    describe('given a valid id', () => {
      it('should return a status of 204', async () => {
        // @ts-ignore
        User.findByIdAndDelete.mockImplementationOnce(() => userItem)
        // @ts-ignore
        await deleteUser(req, res)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: null })
      })
    })
  })
})
