import * as React from "react";

import { Redirect } from "react-router";

import { UserDisplayItem } from "../../models/user-display-item";

interface IState {
    fetching: boolean;
    error: boolean;
    items: UserDisplayItem[];
}

const UsersTable: React.FC = () => {
    const [state, setState] = React.useState<IState>({
        fetching: true,
        error: false,
        items: []
    });

    React.useEffect(
        () => {
            fetch("users/getall")
                .then(response => {
                    response
                        .json()
                        .then((users: UserDisplayItem[]) => {
                            setState({
                                fetching: false,
                                error: false,
                                items: users
                            });
                        });
                })
                .catch(() =>
                    setState({
                        fetching: false,
                        error: true,
                        items: []
                    })
                );
        },
        [setState]
    );

    if (state.fetching) {
        return <p><em>Loading...</em></p>;
    }

    if (state.error) {
        return <Redirect to="auth/login" />;
    }

    return (
        <div>
            <h1 id="tabelLabel" >Users</h1>
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {state.items.map(user =>
                        <tr key={user.email}>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.displayAddress}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export { UsersTable }
