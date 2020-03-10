import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { RouteProps } from "react-router";
import { UserContext } from "./UserContext";

const AuthorizedRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
    const { user } = React.useContext(UserContext);
    const Component = component as React.ComponentClass;
    debugger;
    
    return (
        <Route
            {...rest}
            render={props => {
                return user?.loggedIn
                    ? <Component {...props} />
                    : <Redirect to="/auth/login" />
            }}
        />
    );
}

export { AuthorizedRoute };
