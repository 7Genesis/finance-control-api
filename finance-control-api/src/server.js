"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var app_1 = require("./app");
var auth_routes_1 = require("./routes/auth.routes");
var error_middleware_1 = require("./middlewares/error.middleware");
app_1.default.use(error_middleware_1.errorMiddleware);
app_1.default.use("/auth", auth_routes_1.default);
var PORT = process.env.PORT || 3333;
app_1.default.listen(PORT, function () {
    console.log("Server running on http://localhost:".concat(PORT));
});
