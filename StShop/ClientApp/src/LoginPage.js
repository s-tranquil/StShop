"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var UserContext_1 = require("./UserContext");
//import { RouteProps } from "react-router"
var LoginPage = function () {
    var history = react_router_dom_1.useHistory();
    var _a = React.useContext(UserContext_1.UserContext), user = _a.user, setUser = _a.setUser;
    return (React.createElement("div", null,
        React.createElement("h1", null, "Login Page"),
        React.createElement("p", null,
            "For this example application, we cannot visit ",
            React.createElement(react_router_dom_1.Link, { to: "/app" }, "/app"),
            " until we are logged in. Clicking the \"Login\" button will simulate a login by setting Redux state. This example compliments the CSS-Tricks article I wrote for ",
            React.createElement("a", { target: "_blank", href: "https://css-tricks.com/react-router-4/" }, "React Router 4"),
            "."),
        React.createElement("button", { onClick: function () {
                setUser({
                    loggedIn: true,
                    userName: "David"
                });
                //login().then(() => {
                history.push('/app');
                //})
            } }, "Login")));
};
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map