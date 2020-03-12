"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_router_dom_1 = require("react-router-dom");
var UserContext_1 = require("./UserContext");
//import { RouteProps } from "react-router"
var react_hook_form_1 = require("react-hook-form");
var emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var LoginPage = function () {
    var history = react_router_dom_1.useHistory();
    var setUser = React.useContext(UserContext_1.UserContext).setUser;
    var _a = react_hook_form_1.useForm(), register = _a.register, handleSubmit = _a.handleSubmit, errors = _a.errors;
    var onSubmit = React.useCallback(function (submitData) {
        fetch("account/login", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData)
        })
            .then(function (response) {
            console.log(response);
            response
                .json()
                .then(function (user) {
                setUser({
                    loggedIn: true,
                    userName: user.email
                });
                history.push('/app');
            });
        })
            .catch(); // TODO: add 401 handling
    }, [setUser, history]);
    return (React.createElement("div", null,
        React.createElement("h1", null, "Login Page"),
        React.createElement("form", { onSubmit: handleSubmit(onSubmit) },
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "email" }, "Email"),
                React.createElement("input", { name: "email", ref: register({ required: true, pattern: emailRegexp }) }),
                errors.email && React.createElement("span", null, "Enter a valid email")),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "email" }, "Password"),
                React.createElement("input", { name: "password", type: "password", ref: register({ required: true }) }),
                errors.name && React.createElement("span", null, "Enter a password")),
            React.createElement("input", { type: "submit" }))));
};
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map