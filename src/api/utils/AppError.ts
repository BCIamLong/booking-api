export default class AppError extends Error {
  private status: string
  private isOperation: boolean
  constructor(
    private statusCode: number,
    private msg: string
  ) {
    super(msg)
    this.status = statusCode < 500 ? 'fail' : 'error'
    this.isOperation = true
    Error.captureStackTrace(this, this.constructor)
  }
}
