import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Tree, Button, DatePicker } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";

import { Link } from "react-router-dom";
import TreeRow from "./TreeRow";

import "./Sidebar.css";

function buildTreeBranch(parentId, accountsById) {
  const children = [];
  Object.values(accountsById).forEach(account => {
    if (account.parent_id === parentId) {
      children.push({
        title: <TreeRow account={account} />,
        key: account.id,
        children: buildTreeBranch(account.id, accountsById)
      });
    }
  });
  return children;
}

const Sidebar = ({ accounts, accountsView, actions }) => {
  useEffect(() => {
    actions.fetchAccounts();
  }, [actions]);

  const treeData = buildTreeBranch(null, accounts.byId);

  const onSelectAccount = (selectedKeys, e) => {
    actions.selectAccount({ id: selectedKeys[0] });
  };

  const onSelectDateRange = (dates, dateStrings) => {
    actions.selectDateRange(dateStrings);
  };

  return (
    <div className="sidebar__container">
      <h2>Accounts</h2>
      <DatePicker.RangePicker
        picker="month"
        value={accountsView.dateRange.map(val => moment(val))}
        onChange={onSelectDateRange}
      />
      <Tree
        treeData={treeData}
        // expandedKeys={accounts.data.map(account => account.id)}
        defaultExpandAll
        blockNode
        showLine
        selectedKeys={[accountsView.activeTabId]}
        onSelect={onSelectAccount}
      />
      <Button icon={<PlusOutlined />}>Add Account</Button>
      <Link to="/bulk-import">
        <Button icon={<UploadOutlined />}>Import Transactions</Button>
      </Link>
    </div>
  );
};

Sidebar.propTypes = {
  accounts: PropTypes.object.isRequired
};

export default Sidebar;
