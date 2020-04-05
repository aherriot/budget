import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";

const TransactionsTable = ({
  accounts,
  transactions,
  onSelectAccount,
  activeTabId
}) => {
  return (
    <div>
      <Table
        size="small"
        pagination={false}
        key="id"
        columns={[
          {
            title: "Date",
            key: "date",
            render: row => {
              if (row.inAccountId === activeTabId) {
                return row.inDate;
              } else {
                return row.outDate;
              }
            }
          },
          {
            title: "Out Account",
            dataIndex: "outAccount",
            key: "outAccount",
            render: val => (
              <span onClick={() => onSelectAccount(val)}>
                {accounts.byId[val]?.name}
              </span>
            )
          },
          {
            title: "In Account",
            dataIndex: "inAccount",
            key: "inAccount",
            render: val => (
              <span onClick={() => onSelectAccount(val)}>
                {accounts.byId[val]?.name}
              </span>
            )
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description"
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: val => "$" + (val / 100).toFixed(2)
          }
        ]}
        dataSource={transactions.data}
      ></Table>
    </div>
  );
};

TransactionsTable.propTypes = {
  acccounts: PropTypes.object.isRequired,
  transactions: PropTypes.object.isRequired,
  onSelectAccount: PropTypes.func.isRequired,
  activeTabId: PropTypes.string.isRequired
};

export default TransactionsTable;
