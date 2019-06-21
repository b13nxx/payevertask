"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const fs = require("fs");
const BaseService_1 = require("./BaseService");
const HttpStatus_1 = require("../definition/HttpStatus");
class User extends BaseService_1.default {
    constructor(router) {
        super(router);
        this.router.get('/:userId', function (req, res, next) {
            request('https://reqres.in/api/users/' + req.params.userId, function (error, response, body) {
                if (error)
                    next(error);
                BaseService_1.default.send(res, HttpStatus_1.default.OK, JSON.parse(body).data);
            });
        });
        this.router.get('/:userId/avatar', function (req, res, next) {
            request('https://reqres.in/api/users/' + req.params.userId, function (error, response, body) {
                if (error)
                    next(error);
                let filename = JSON.parse(body).data.avatar.split('/');
                filename = filename[filename.length - 2] + '.jpg';
                if (!fs.existsSync('src/images/' + filename)) {
                    request(JSON.parse(body).data.avatar, function (error, response, body) {
                        if (error)
                            next(error);
                    }).pipe(fs.createWriteStream('src/images/' + filename)).on('close', function () {
                        BaseService_1.default.send(res, HttpStatus_1.default.OK, BaseService_1.default.getImageAsBase64(filename));
                    });
                }
                else {
                    BaseService_1.default.send(res, HttpStatus_1.default.OK, BaseService_1.default.getImageAsBase64(filename));
                }
            });
        });
        this.router.delete('/:userId/avatar', function (req, res, next) {
            request('https://reqres.in/api/users/' + req.params.userId, function (error, response, body) {
                if (error)
                    next(error);
                let filename = JSON.parse(body).data.avatar.split('/');
                filename = filename[filename.length - 2] + '.jpg';
                if (fs.existsSync('src/images/' + filename)) {
                    fs.unlinkSync('src/images/' + filename);
                    BaseService_1.default.send(res, HttpStatus_1.default.OK, filename + ' has been deleted');
                }
                else {
                    BaseService_1.default.send(res, HttpStatus_1.default.NoContent);
                }
            });
        });
    }
}
exports.default = User;
