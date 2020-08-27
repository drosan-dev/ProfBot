import React from 'react';
import LoginPage from './admin/LoginPage'
import StepsPage from './admin/StepsPage'
import UsersPage from './admin/UsersPage'
import './App.css';
import AuthManager from './Services/Auth'

import {
  Route,
  Switch,
  Redirect
} from "react-router-dom"

const auth = new AuthManager()

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    auth.isAuthorized() ? <Component {...props} /> : <Redirect to='/admin/login' />
  )} />
);

function App(props) {
  return (
    <div className="App">
      <Switch>
        <Route history={props.history} exact path='/admin/login' component={LoginPage} />
        <PrivateRoute history={props.history} exact path='/admin/steps' component={StepsPage} />
        <PrivateRoute history={props.history} exact path='/admin/users' component={UsersPage} />
        <Redirect from="/admin" to="/admin/steps" />
        <Redirect from="*" to="/admin/steps" />
      </Switch>
    </div>
  );
}

export default App;
