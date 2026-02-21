"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DashboardPage;
var AuthContext_1 = require("@/context/AuthContext");
function DashboardPage() {
    var _a = (0, AuthContext_1.useAuth)(), user = _a.user, logout = _a.logout;
    return (<div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      {user ? (<>
          <p>Usuário autenticado</p>
          <button onClick={logout}>Sair</button>
        </>) : (<p>Não autenticado</p>)}
    </div>);
}
