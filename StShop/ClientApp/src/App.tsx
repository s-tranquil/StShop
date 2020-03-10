import * as React from 'react';
import { Route, Redirect } from 'react-router';
import { Switch } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { AuthorizedRoute } from "./AuthorizedRoute";
import { UnauthorizedLayout } from "./UnauthorizedLayout";
import { UserProvider } from "./UserContext";

import './custom.css'

export default class App extends React.Component {
    static displayName = App.name;

    render() {
        return (
            <UserProvider>
                <Layout>
                    <Switch>
                        <Route path="/auth" component={UnauthorizedLayout} />
                        <AuthorizedRoute path="/app" component={() => <Home />} />
                        <Redirect to="/auth" />
                        {/*<Route exact path='/' component={Home} />
                        <Route path='/counter' component={Counter} />
                        <Route path='/fetch-data' component={FetchData} /> */}
                    </Switch>
                </Layout>
            </UserProvider>
        );
    }
}
