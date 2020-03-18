import * as React from "react";

import {
    Redirect,
    Route,
    Switch
} from "react-router-dom";

// Pages
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";

const UnauthorizedLayout = () => (
    <div className="unauthorized-layout">
        <Switch>
            <Route path="/auth/login" component={LoginPage} />
            <Route path="/auth/register" component={RegisterPage} />
            <Redirect to="/auth/login" />
        </Switch>
    </div>
)

export { UnauthorizedLayout };