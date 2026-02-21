"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var JWT_SECRET = process.env.JWT_SECRET;
var authenticate = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    var token = authHeader.split(" ")[1];
    try {
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = {
            userId: decoded.userId,
        };
        next();
    }
    catch (_a) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
exports.authenticate = authenticate;
