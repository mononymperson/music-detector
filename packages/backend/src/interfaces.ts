import { ApiResponse } from 'common'
import { Response } from 'express'

export interface JSONResponse<T> extends Omit<Response, 'json'> {
  json: (data: ApiResponse<T>) => void
}
