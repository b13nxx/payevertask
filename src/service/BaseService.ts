import { Request, Response, Router } from 'express'
import HttpStatus from '../definition/HttpStatus'
import * as fs from 'fs'

export default class BaseService {
  public router: Router

  constructor (router: Router) {
    this.router = Router()
    this.setup(router)
  }

  private getName (): string {
    return this.constructor.name.toLowerCase()
  }

  private setup (router: Router): void {
    router.use('/' + this.getName(), this.router)
    this.router.get('/', (req: Request, res: Response) => BaseService.send(res, HttpStatus.NoContent))
  }

  static send (res: Response, status: HttpStatus, response = {}): void {
    status === HttpStatus.OK || status === HttpStatus.Created || status === HttpStatus.MovedPermanently ? res.status(status).json(response) : res.sendStatus(status)
  }

  static getImageAsBase64 (filename: string): string {
    let bitmap = fs.readFileSync('src/images/' + filename)
    return 'data:image/jpeg;base64,' + Buffer.from(bitmap).toString('base64')
  }
}
