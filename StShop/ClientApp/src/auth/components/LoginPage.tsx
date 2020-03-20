import * as React from "react";

import { useForm } from "react-hook-form";
import {
    Link,
    useHistory
} from "react-router-dom";
import {
    Button,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import { nameof } from "ts-simple-nameof";

import { emailRegexp } from "../../constants";
import { UserContext } from "../../contracts";

import { LoginModel } from "../../models/login-model";
import { User } from "../../models/user";

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
                            history.push('/users')
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

            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup>
                    <Label htmlFor={fieldNames.email}>Email</Label>
                    <Input name={fieldNames.email} innerRef={register({ required: true, pattern: emailRegexp })} />
                    {errors[fieldNames.email] && <FormFeedback>Enter a valid email</FormFeedback>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor={fieldNames.password}>Password</Label>
                    <Input name={fieldNames.password} type="password" innerRef={register({ required: true })} />
                    {errors[fieldNames.password] && <FormFeedback>Enter a password</FormFeedback>}
                </FormGroup>

                <Button>Submit</Button>
            </Form>
        </div>
    )
};

export { LoginPage };