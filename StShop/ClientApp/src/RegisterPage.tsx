import * as React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from "./UserContext";
import { useForm } from "react-hook-form";
import { User } from "./models/user";
import { emailRegexp } from "./constants";
import { RegisterModel } from "./models/register-model";
import { nameof } from "ts-simple-nameof";

const fieldNames = {
    email: nameof<RegisterModel>(x => x.email),
    name: nameof<RegisterModel>(x => x.name),
    surname: nameof<RegisterModel>(x => x.surname),
    password: nameof<RegisterModel>(x => x.password),
    address: nameof<RegisterModel>(x => x.address)
};

const RegisterPage: React.FC<any> = () => {
    const history = useHistory();
    const { setUser } = React.useContext(UserContext);
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = React.useCallback(
        (submitData) => {
            fetch(
                "account/register",
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
            <h1>Register Page</h1>

            {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor={fieldNames.email}>Email</label>
                    <input
                        name={fieldNames.email}
                        ref={register({ required: true, pattern: emailRegexp })} 
                    />
                    {errors[fieldNames.email] && <span>Enter a valid email</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.name}>Name</label>
                    <input
                        name={fieldNames.name}
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.name] && <span>Enter your name</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.surname}>Surname</label>
                    <input
                        name={fieldNames.surname}
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.surname] && <span>Enter your surname</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.address}>Address</label>
                    <input
                        name={fieldNames.address}
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.address] && <span>Enter your address</span>}
                </div>

                <div>
                    <label htmlFor={fieldNames.password}>Choose a password</label>
                    <input
                        name={fieldNames.password}
                        type="password"
                        ref={register({ required: true })} 
                    />
                    {errors[fieldNames.password] && <span>Enter a password</span>}
                </div>

                <input type="submit" />
            </form>
        </div>
    )
};

export { RegisterPage };