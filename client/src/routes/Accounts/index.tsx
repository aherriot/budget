import React from "react";

import Header from "components/Header";
import Tabs from "./Tabs";
import Sidebar from "./Sidebar";

import "./Accounts.css";

const Accounts = () => {
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
