import * as React from "react";

import "../styles/custom.css";

import {
    Redirect,
    Route
} from "react-router";
import { Switch } from "react-router-dom";

import { UnauthorizedLayout } from "../../auth";
import { UserProvider } from "../../contracts";
import { UsersTable } from "../../users";
import { AuthorizedRoute } from "./AuthorizedRoute";
import { Layout } from "./Layout";

const App: React.FC = () => (
    <UserProvider>
        <Layout>
            <Switch>
                <Route path="/auth" component={UnauthorizedLayout} />
                <AuthorizedRoute path="/users" component={UsersTable} />
                <Redirect to="/auth" />
            </Switch>
        </Layout>
    </UserProvider>
);

export { App }
