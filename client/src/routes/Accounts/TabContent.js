import React, { useState } from "react";
import { Radio, Space } from "antd";

import TransactionsTable from "./TransactionsTable";
import TransactionsChart from "./TransactionsChart";
import AddTransactionDialog from "./AddTransactionDialog";

import "./TabContent.css";
const TabContent = ({
  actions,
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
        <div>
          <Radio.Group
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="table">Table</Radio.Button>
            <Radio.Button value="chart">Chart</Radio.Button>
          </Radio.Group>
        </div>
        <Space>
          <span>
            <b>Type:</b> {accounts.byId[accountId].type}
          </span>
          <span>
            <b>Total:</b> $
            {(
              transactions.data.reduce(
                (acc, val) => acc + val.inAmount - val.outAmount,
                0
              ) / 100
            ).toFixed(2)}
          </span>
        </Space>
      </div>
      {selectedView === "table" && (
        <TransactionsTable
          actions={actions}
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
