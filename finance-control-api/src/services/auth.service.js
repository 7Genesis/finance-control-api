"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginService = exports.registerService = void 0;
var database_1 = require("../database");
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET não definido no .env");
}
var JWT_SECRET = process.env.JWT_SECRET;
var registerService = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var name, email, password, checkUser, hashedPassword, insertUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = data.name, email = data.email, password = data.password;
                return [4 /*yield*/, database_1.connection.query("SELECT id FROM users WHERE email = $1", [email])];
            case 1:
                checkUser = _a.sent();
                if (checkUser.rows.length > 0) {
                    throw new Error("Email já cadastrado");
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, database_1.connection.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id", [name, email, hashedPassword])];
            case 3:
                insertUser = _a.sent();
                return [2 /*return*/, {
                        message: "Usuário criado com sucesso",
                        id: insertUser.rows[0].id,
                    }];
        }
    });
}); };
exports.registerService = registerService;
var loginService = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var email, password, result, user, isValid, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = data.email, password = data.password;
                return [4 /*yield*/, database_1.connection.query("SELECT * FROM users WHERE email = $1", [email])];
            case 1:
                result = _a.sent();
                if (result.rows.length === 0) {
                    throw new Error("Credenciais inválidas");
                }
                user = result.rows[0];
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 2:
                isValid = _a.sent();
                if (!isValid) {
                    throw new Error("Credenciais inválidas");
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });
                return [2 /*return*/, { token: token }];
        }
    });
}); };
exports.loginService = loginService;
