"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_1 = require("react-router");
var react_router_dom_1 = require("react-router-dom");
var Layout_1 = require("./components/Layout");
var Home_1 = require("./components/Home");
var FetchData_1 = require("./components/FetchData");
var AuthorizedRoute_1 = require("./AuthorizedRoute");
var UnauthorizedLayout_1 = require("./UnauthorizedLayout");
var UserContext_1 = require("./UserContext");
require("./custom.css");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return (React.createElement(UserContext_1.UserProvider, null,
            React.createElement(Layout_1.Layout, null,
                React.createElement(react_router_dom_1.Switch, null,
                    React.createElement(react_router_1.Route, { path: "/auth", component: UnauthorizedLayout_1.UnauthorizedLayout }),
                    React.createElement(AuthorizedRoute_1.AuthorizedRoute, { path: "/app", component: Home_1.Home }),
                    React.createElement(AuthorizedRoute_1.AuthorizedRoute, { path: "/fetch-data", component: FetchData_1.FetchData }),
                    React.createElement(react_router_1.Redirect, { to: "/auth" })))));
    };
    App.displayName = App.name;
    return App;
}(React.Component));
exports.default = App;
//# sourceMappingURL=App.js.map