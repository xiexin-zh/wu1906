import React from "react";
import { Router, Route, Switch } from "dva/router";
import Home from "./routes/home";
import Pplist from "./routes/pplist";
import ImaxSprint from "./routes/sprint";
import AnotherHome from "./routes/pplist";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route
          path="/pplist"
          exact
          render={(props) => <Pplist {...props} show={true} />}
        />
        <Route
          path="/charts"
          exact
          render={(props) => (
            <AnotherHome {...props} chart={true} show={true} />
          )}
        />
        <Route
          path="/imax"
          exact
          render={(props) => (
            <ImaxSprint {...props} team={"IMax"} show={true} />
          )}
        />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
