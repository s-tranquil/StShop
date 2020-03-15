import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserProvider, UserContext } from "./UserContext";
import { useForm } from "react-hook-form";
import { User } from "./models/user";
import { emailRegexp } from "./constants";
import { LoginModel } from "./models/login-model";
import { nameof } from "ts-simple-nameof";

const fieldNames = {
    email: nameof<LoginModel>(x => x.email),
    password: nameof<LoginModel>(x => x.password)
};

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
            <Link to="/auth/register">To register page</Link>

            {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor={fieldNames.email}>Email</label>
                    <input name={fieldNames.email} ref={register({ required: true, pattern: emailRegexp })} />
                    {errors[fieldNames.email] && <span>Enter a valid email</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.password}>Password</label>
                    <input name={fieldNames.password} type="password" ref={register({ required: true })} />
                    {errors[fieldNames.password] && <span>Enter a password</span>}
                </div>

                <input type="submit" />
            </form>
        </div>
    )
};

export { LoginPage };