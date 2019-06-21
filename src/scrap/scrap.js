"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const fs = require("fs");
function cron(ms, fn) {
    function cb() {
        clearTimeout(timeout);
        timeout = setTimeout(cb, ms);
        fn();
    }
    let timeout = setTimeout(cb, ms);
}
let page = 1;
cron(60000, function () {
    request('https://reqres.in/api/users?page=' + page, function (error, response, body) {
        let data = JSON.parse(fs.readFileSync('src/scrap/users.json', 'utf8'));
        data = data.concat(JSON.parse(body).data);
        fs.writeFileSync('src/scrap/users.json', JSON.stringify(data));
    });
    page++;
});
