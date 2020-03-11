import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserProvider, UserContext } from "./UserContext";
//import { RouteProps } from "react-router"

const LoginPage: React.FC<any> = () => {
    const history = useHistory();
    const { setUser } = React.useContext(UserContext);

    const onClick = React.useCallback(
        () => {
            fetch(
                "account/login",
                {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        Username: "a@a.com",
                        Password: "123"
                    })
                })
                .then(response => {
                    console.log(response);
                    response
                        .json()
                        .then(json => {
                            // get user from response
                            setUser({
                                loggedIn: true,
                                userName: "a@a.com"
                            });
                            history.push('/app')
                        });
                })
                .catch();// add 401 handling

        },
        [setUser, history]
    );

    return (
        <div>
            <h1>Login Page</h1>
            <p>
                    For this example application, we cannot visit <Link to="/app">/app</Link> until we are logged in.
              Clicking the "Login" button will simulate a login by setting Redux state. This example compliments
              the CSS-Tricks article I wrote for <a target="_blank" href="https://css-tricks.com/react-router-4/">React Router 4</a>.
            </p>
            <button onClick={onClick}>
                Login
            </button>
        </div>
    )
};

export { LoginPage };