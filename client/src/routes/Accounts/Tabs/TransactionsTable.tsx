import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table, Input } from "antd";
import moment from "moment";
import actions from "store/actions";
import AddTransactionRow from "./AddTransactionRow";
import formatCurrency from "utils/formatCurrency";
import ColorDot from "components/ColorDot";

interface Props {
  accountId: string;
  onSelectAccount: (id: string) => void;
}

const TransactionsTable = ({ accountId, onSelectAccount }: Props) => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.data.accounts);
  const transactions = useSelector((state) => state.data.transactions);
  const [filterText, setFilterText] = useState("");

  const filteredTransactions = transactions.data.filter((t) => {
    const filter = filterText.toLowerCase();
    return (
      t.description.toLowerCase().includes(filter) ||
      accounts.byId[t.inAccount].name.toLowerCase().includes(filter) ||
      accounts.byId[t.outAccount].name.toLowerCase().includes(filter)
    );
  });
  return (
    <div>
      <Input
        type="text"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <Table
        size="small"
        pagination={false}
        rowKey="id"
        columns={[
          {
            title: "Date",
            key: "date",
            render: (row) => {
              if (row.inAccountId === accountId) {
                return moment(row.inDate).format("YYYY-MM-DD");
              } else {
                return moment(row.outDate).format("YYYY-MM-DD");
              }
            },
          },
          {
            title: "Out Account",
            dataIndex: "outAccount",
            key: "outAccount",
            render: (val) => (
              <span
                className="account-table-cell"
                onClick={() => onSelectAccount(val)}
              >
                <ColorDot color={accounts.byId[val]?.color as string} />
                {accounts.byId[val]?.name}
              </span>
            ),
          },
          {
            title: "In Account",
            dataIndex: "inAccount",
            key: "inAccount",
            render: (val) => (
              <span
                className="account-table-cell"
                onClick={() => onSelectAccount(val)}
              >
                <ColorDot color={accounts.byId[val]?.color as string} />
                {accounts.byId[val]?.name}
              </span>
            ),
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Out",
            dataIndex: "outAmount",
            key: "outAmount",
            render: (val) => (val == null ? "" : formatCurrency(val)),
          },
          {
            title: "In",
            dataIndex: "inAmount",
            key: "inAmount",
            render: (val) => (val == null ? "" : formatCurrency(val)),
          },
          {
            title: "Actions",
            key: "actions",
            dataIndex: "id",
            fixed: "right",
            render: (val) => (
              <Button
                type="link"
                size="small"
                onClick={() => {
                  dispatch(actions.deleteTransaction(val));
                }}
              >
                Delete
              </Button>
            ),
          },
        ]}
        dataSource={filteredTransactions}
      />
      <AddTransactionRow />
    </div>
  );
};

export default TransactionsTable;
