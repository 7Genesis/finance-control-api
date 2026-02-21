"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
require("./globals.css");
var AuthContext_1 = require("@/context/AuthContext");
function RootLayout(_a) {
    var children = _a.children;
    return (<html lang="pt-BR">
      <body>
        <AuthContext_1.AuthProvider>{children}</AuthContext_1.AuthProvider>
      </body>
    </html>);
}
