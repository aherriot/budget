import React, { useState, useEffect } from "react";
import { Radio, Space } from "antd";
import { useSelector } from "react-redux";
import TransactionsTable from "./TransactionsTable";
import TransactionsChart from "./TransactionsChart";
import AddTransactionDialog from "./AddTransactionDialog";

import "./TabContent.css";
import formatCurrency from "utils/formatCurrency";

enum ViewType {
  TABLE = "TABLE",
  CHART = "CHART",
}

interface Props {
  accountId: string;
  onSelectAccount: (key: string) => void;
}

const TabContent = ({ accountId, onSelectAccount }: Props) => {
  // const dispatch = useDispatch();
  // const accountsView = useSelector((state) => state.routes.accounts);
  const accounts = useSelector((state) => state.data.accounts);
  const transactions = useSelector((state) => state.data.transactions);

  const [selectedView, setSelectedView] = useState<ViewType>(ViewType.CHART);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("TabContent mounting");
    return () => console.log("TabContent unmounting");
  }, []);

  return (
    <div>
      <div className="TabContent--actions">
        <div>
          <Radio.Group
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value={ViewType.TABLE}>Table</Radio.Button>
            <Radio.Button value={ViewType.CHART}>Chart</Radio.Button>
          </Radio.Group>
        </div>
        <Space>
          <span>
            <b>Type:</b> {accounts.byId[accountId].type}
          </span>
          <span>
            <b>Total:</b>
            {formatCurrency(
              transactions.data.reduce(
                (acc, val) => acc + val.inAmount - val.outAmount,
                0
              )
            )}
          </span>
        </Space>
      </div>
      {selectedView === ViewType.TABLE && (
        <TransactionsTable
          accountId={accountId}
          onSelectAccount={onSelectAccount}
        />
      )}
      {selectedView === ViewType.CHART && (
        <TransactionsChart accountId={accountId} />
      )}
      <AddTransactionDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default TabContent;
