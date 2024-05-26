import { Query } from 'mongoose'

export default class APIFeaturesMock<T> {
  constructor(
    // @ts-ignore
    public query: Query<T[], T> = Promise.resolve({ data: ['item1'] }),
    public queryStr: any = {}
  ) {}

  filter = jest.fn().mockReturnThis()
  sort = jest.fn().mockReturnThis()
  selectFields = jest.fn().mockReturnThis()
  pagination = jest.fn().mockResolvedValue({
    query: jest.fn().mockResolvedValue(['item1'])
  })
}
