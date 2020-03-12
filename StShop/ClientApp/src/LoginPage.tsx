import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserProvider, UserContext } from "./UserContext";
//import { RouteProps } from "react-router"
import { useForm } from "react-hook-form";
import { User } from "./models/user";

const emailRegexp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const LoginPage: React.FC<any> = () => {
    const history = useHistory();
    const { setUser } = React.useContext(UserContext);
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = React.useCallback(
        (submitData) => {
            fetch(
                "account/login",
                {
                    method: "POST",
                    cache: "no-cache",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(submitData)
                })
                .then(response => {
                    console.log(response);
                    response
                        .json()
                        .then((user: User) => {
                            setUser({
                                loggedIn: true,
                                userName: user.email
                            });
                            history.push('/app')
                        });
                })
                .catch();// TODO: add 401 handling

        },
        [setUser, history]
    );

    return (
        <div>
            <h1>Login Page</h1>

            {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input name="email" ref={register({ required: true, pattern: emailRegexp })} />
                    {errors.email && <span>Enter a valid email</span>}
                </div>

                <div>
                    <label htmlFor="email">Password</label>
                    <input name="password" type="password" ref={register({ required: true })} />
                    {errors.name && <span>Enter a password</span>}
                </div>

                <input type="submit" />
            </form>
        </div>
    )
};

export { LoginPage };