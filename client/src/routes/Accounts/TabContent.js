import React, { useState } from "react";
// import PropTypes from "prop-types";
import { Radio, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import TransactionsTable from "./TransactionsTable";
import TransactionsChart from "./TransactionsChart";
import AddTransactionDialog from "./AddTransactionDialog";

import "./TabContent.css";
const TabContent = ({
  accountId,
  accounts,
  transactions,
  accountsView,
  onSelectAccount,
}) => {
  const [selectedView, setSelectedView] = useState("table");
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <div>
      <div className="TabContent--actions">
        <Radio.Group
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="table">Table</Radio.Button>
          <Radio.Button value="chart">Chart</Radio.Button>
        </Radio.Group>
        <Button icon={<PlusOutlined />} onClick={() => setOpenDialog(true)}>
          Add Transaction
        </Button>
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
      <AddTransactionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

TabContent.propTypes = {};

export default TabContent;
