import { NextFunction, Request, Response } from 'express'
import { logger } from '../app'

export function myMorgan (req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.url}`)
  next()
}
