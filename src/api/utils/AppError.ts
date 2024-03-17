export default class AppError extends Error {
  private _status: string
  private _isOperation: boolean
  private _statusCode: number
  private _msg
  constructor(statusCode: number, msg: string) {
    super(msg)
    this._status = statusCode < 500 ? 'fail' : 'error'
    this._msg = msg
    this._statusCode = statusCode
    this._isOperation = true
    Error.captureStackTrace(this, this.constructor)
  }

  public get status() {
    return this._status
  }

  public set status(val: string) {
    this._status = val
  }

  public get statusCode() {
    return this._statusCode
  }

  public set statusCode(val: number) {
    this._statusCode = val
  }

  public get isOperation() {
    return this._isOperation
  }

  public set isOperation(val: boolean) {
    this._isOperation = val
  }
}
