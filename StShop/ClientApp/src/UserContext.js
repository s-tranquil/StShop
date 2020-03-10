"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var UserContext = React.createContext({});
exports.UserContext = UserContext;
var UserProvider = function (_a) {
    var children = _a.children;
    var _b = React.useState(), user = _b[0], setUser = _b[1];
    return (React.createElement(UserContext.Provider, { value: {
            user: user,
            setUser: setUser
        } }, children));
};
exports.UserProvider = UserProvider;
//# sourceMappingURL=UserContext.js.map