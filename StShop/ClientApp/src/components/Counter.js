"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
exports.Counter = function () {
    var _a = React.useState(0), currentCount = _a[0], setCurrentCount = _a[1];
    var increment = React.useCallback(function () { return setCurrentCount(function (prevState) { return prevState + 1; }); }, [setCurrentCount]);
    return (React.createElement("div", null,
        React.createElement("h1", null, "Counter"),
        React.createElement("p", null, "This is a simple example of a React component."),
        React.createElement("p", { "aria-live": "polite" },
            "Current count: ",
            React.createElement("strong", null, currentCount)),
        React.createElement("button", { className: "btn btn-primary", onClick: increment }, "Increment")));
};
//# sourceMappingURL=Counter.js.map