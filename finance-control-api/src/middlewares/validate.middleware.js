"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var zod_1 = require("zod");
var validate = function (schema) {
    return function (req, res, next) {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: error.issues[0].message,
                });
            }
            return res.status(500).json({
                success: false,
                error: "Internal server error",
            });
        }
    };
};
exports.validate = validate;
