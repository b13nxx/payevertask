import { NextFunction, Request, Response, Router } from 'express'
import * as request from 'request'
import * as fs from 'fs'
import BaseService from './BaseService'
import HttpStatus from '../definition/HttpStatus'

export default class User extends BaseService {
  constructor (router: Router) {
    super(router)

    this.router.get('/:userId', function (req: Request, res: Response, next: NextFunction) {
      request('https://reqres.in/api/users/' + req.params.userId, function (error, response, body) {
        if (error) next(error)
        BaseService.send(res, HttpStatus.OK, JSON.parse(body).data)
      })
    })

    this.router.get('/:userId/avatar', function (req: Request, res: Response, next: NextFunction) {
      request('https://reqres.in/api/users/' + req.params.userId, function (error, response, body) {
        if (error) next(error)

        let filename = JSON.parse(body).data.avatar.split('/')
        filename = filename[filename.length - 2] + '.jpg'

        if (!fs.existsSync('src/images/' + filename)) {
          request(JSON.parse(body).data.avatar, function (error, response, body) {
            if (error) next(error)
          }).pipe(fs.createWriteStream('src/images/' + filename)).on('close', function () {
            BaseService.send(res, HttpStatus.OK, BaseService.getImageAsBase64(filename))
          })
        } else {
          BaseService.send(res, HttpStatus.OK, BaseService.getImageAsBase64(filename))
        }
      })
    })

    this.router.delete('/:userId/avatar', function (req: Request, res: Response, next: NextFunction) {
      request('https://reqres.in/api/users/' + req.params.userId, function (error, response, body) {
        if (error) next(error)

        let filename = JSON.parse(body).data.avatar.split('/')
        filename = filename[filename.length - 2] + '.jpg'

        if (fs.existsSync('src/images/' + filename)) {
          fs.unlinkSync('src/images/' + filename)
          BaseService.send(res, HttpStatus.OK, filename + ' has been deleted')
        } else {
          BaseService.send(res, HttpStatus.NoContent)
        }
      })
    })
  }
}
