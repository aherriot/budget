import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import store from "store";
import "./App.css";

import Accounts from "routes/Accounts";
import BulkImport from "routes/BulkImport";
import Login from "routes/Login";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/" exact component={Accounts}></Route>
          <Route path="/accounts" exact component={Accounts}></Route>
          <Route path="/bulk-import" exact component={BulkImport} />
          <Route path="/login" exact component={Login}></Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
