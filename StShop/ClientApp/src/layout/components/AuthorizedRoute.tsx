import * as React from "react";

import { RouteProps } from "react-router";
import {
    Redirect,
    Route
} from "react-router-dom";

import { UserContext } from "../../contracts";

const AuthorizedRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
    const { user } = React.useContext(UserContext);
    const Component = component as React.ComponentClass;
    
    return (
        <Route
            {...rest}
            render={props => {
                return user?.email
                    ? <Component {...props} />
                    : <Redirect to="/auth/login" />
            }}
        />
    );
}

export { AuthorizedRoute };
