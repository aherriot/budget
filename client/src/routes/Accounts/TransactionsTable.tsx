import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Table } from "antd";
import moment from "moment";
import actions from "store/actions";
import AddTransactionRow from "./AddTransactionRow";

interface Props {
  accountId: string;
  onSelectAccount: (id: string) => void;
}

const TransactionsTable = ({ accountId, onSelectAccount }: Props) => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.data.accounts);
  const transactions = useSelector((state) => state.data.transactions);

  return (
    <div>
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
              <span onClick={() => onSelectAccount(val)}>
                {accounts.byId[val]?.name}
              </span>
            ),
          },
          {
            title: "In Account",
            dataIndex: "inAccount",
            key: "inAccount",
            render: (val) => (
              <span onClick={() => onSelectAccount(val)}>
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
            render: (val) => (val == null ? "" : "$" + (val / 100).toFixed(2)),
          },
          {
            title: "In",
            dataIndex: "inAmount",
            key: "inAmount",
            render: (val) => (val == null ? "" : "$" + (val / 100).toFixed(2)),
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
        dataSource={transactions.data}
      />
      <AddTransactionRow />
    </div>
  );
};

export default TransactionsTable;
