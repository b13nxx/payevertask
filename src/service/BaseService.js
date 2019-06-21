"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HttpStatus_1 = require("../definition/HttpStatus");
const fs = require("fs");
class BaseService {
    constructor(router) {
        this.router = express_1.Router();
        this.setup(router);
    }
    getName() {
        return this.constructor.name.toLowerCase();
    }
    setup(router) {
        router.use('/' + this.getName(), this.router);
        this.router.get('/', (req, res) => BaseService.send(res, HttpStatus_1.default.NoContent));
    }
    static send(res, status, response = {}) {
        status === HttpStatus_1.default.OK || status === HttpStatus_1.default.Created || status === HttpStatus_1.default.MovedPermanently ? res.status(status).json(response) : res.sendStatus(status);
    }
    static getImageAsBase64(filename) {
        let bitmap = fs.readFileSync('src/images/' + filename);
        return 'data:image/jpeg;base64,' + Buffer.from(bitmap).toString('base64');
    }
}
exports.default = BaseService;
