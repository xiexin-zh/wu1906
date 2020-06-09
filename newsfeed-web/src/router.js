import React from 'react';
import { Router, Route, Switch } from 'dva/router';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useParams,
//   useRouteMatch
// } from "react-router-dom";

import AuthorizedRoute from './routes/AuthorizedRoute';
import LoginPage from './routes/LoginPage';
import Home from './routes/Home';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <AuthorizedRoute path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
