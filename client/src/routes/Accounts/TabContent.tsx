import React, { useState } from "react";
import { Radio, Space } from "antd";
import { useSelector } from "react-redux";
import TransactionsTable from "./TransactionsTable";
import TransactionsChart from "./TransactionsChart";
import AddTransactionDialog from "./AddTransactionDialog";

import "./TabContent.css";

interface Props {
  accountId: string;
  onSelectAccount: (key: string) => void;
}

const TabContent = ({ accountId, onSelectAccount }: Props) => {
  // const dispatch = useDispatch();
  // const accountsView = useSelector((state) => state.routes.accounts);
  const accounts = useSelector((state) => state.data.accounts);
  const transactions = useSelector((state) => state.data.transactions);

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
          accountId={accountId}
          onSelectAccount={onSelectAccount}
        />
      )}
      {selectedView === "chart" && <TransactionsChart accountId={accountId} />}
      <AddTransactionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default TabContent;
