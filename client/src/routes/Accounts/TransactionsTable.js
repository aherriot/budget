import React from "react";
import PropTypes from "prop-types";
import { Table } from "antd";
import moment from "moment";

const TransactionsTable = ({
  accounts,
  transactions,
  onSelectAccount,
  activeTabId,
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
            render: (row) => {
              if (row.inAccountId === activeTabId) {
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
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (val) => "$" + (val / 100).toFixed(2),
          },
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
  activeTabId: PropTypes.string.isRequired,
};

export default TransactionsTable;
