import React from "react";
// import PropTypes from "prop-types";

// import useApi from "utils/useApi";
import Header from "components/Header";
import Tabs from "./redux/tabsContainer";
import Sidebar from "./redux/sidebarContainer";

import "./Accounts.css";

const Accounts = props => {
  // const [accounts, accountsIsLoading, accountsError] = useApi(
  //   "/api/accounts",
  //   []
  // );

  return (
    <div className="accounts_container">
      <Header />
      <div className="accounts__content">
        <Sidebar />
        <Tabs />
      </div>
    </div>
  );
};

Accounts.propTypes = {};

export default Accounts;
