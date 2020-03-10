import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserProvider, UserContext } from "./UserContext";
//import { RouteProps } from "react-router"

const LoginPage: React.FC<any> = () => {
    const history = useHistory();
    const { user, setUser } = React.useContext(UserContext);

    return (
        <div>
            <h1>Login Page</h1>
            <p>
                    For this example application, we cannot visit <Link to="/app">/app</Link> until we are logged in.
              Clicking the "Login" button will simulate a login by setting Redux state. This example compliments
              the CSS-Tricks article I wrote for <a target="_blank" href="https://css-tricks.com/react-router-4/">React Router 4</a>.
            </p>
            <button onClick={
                    () => {
                        setUser({
                            loggedIn: true,
                            userName: "David"
                        });
                                //login().then(() => {
                        history.push('/app')
                                //})
                    }
                }
            >
                Login
            </button>
        </div>
    )
};

export { LoginPage };