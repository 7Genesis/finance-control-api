"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
var axios_1 = require("axios");
exports.api = axios_1.default.create({
    baseURL: "https://finance-control-api-8qpp.onrender.com",
});
exports.api.interceptors.request.use(function (config) {
    var token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = "Bearer ".concat(token);
    }
    return config;
});
