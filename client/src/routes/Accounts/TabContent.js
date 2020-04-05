import React, { useState } from "react";
// import PropTypes from "prop-types";
import { Radio } from "antd";
import TransactionsTable from "./TransactionsTable";
import TransactionsChart from "./TransactionsChart";

const TabContent = ({
  accountId,
  accounts,
  transactions,
  accountsView,
  onSelectAccount
}) => {
  const [selectedView, setSelectedView] = useState("chart");
  return (
    <div>
      <div>
        <Radio.Group
          value={selectedView}
          onChange={e => setSelectedView(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="table">Table</Radio.Button>
          <Radio.Button value="chart">Chart</Radio.Button>
        </Radio.Group>
      </div>
      {selectedView === "table" && (
        <TransactionsTable
          accountId={accountId}
          accounts={accounts}
          transactions={transactions}
          onSelectAccount={onSelectAccount}
          activeTabId={accountsView.activeTabId}
        />
      )}
      {selectedView === "chart" && (
        <TransactionsChart
          accountId={accountId}
          accounts={accounts}
          transactions={transactions}
        />
      )}
    </div>
  );
};

TabContent.propTypes = {};

export default TabContent;
