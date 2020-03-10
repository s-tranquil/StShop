"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
// Pages
var LoginPage_1 = require("./LoginPage");
var UnauthorizedLayout = function () { return (React.createElement("div", { className: "unauthorized-layout" },
    React.createElement(react_router_dom_1.Switch, null,
        React.createElement(react_router_dom_1.Route, { path: "/auth/login", component: LoginPage_1.LoginPage }),
        React.createElement(react_router_dom_1.Redirect, { to: "/auth/login" })))); };
exports.UnauthorizedLayout = UnauthorizedLayout;
//# sourceMappingURL=UnauthorizedLayout.js.map