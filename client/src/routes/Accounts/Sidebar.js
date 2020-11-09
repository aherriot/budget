import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Tree, Button, DatePicker } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import moment from "moment";

import TreeRow from "./TreeRow";

import "./Sidebar.css";
import AddAccountModal from "./AddAccountModal";

function buildTreeBranch(parentId, accountsById) {
  const children = [];
  Object.values(accountsById).forEach((account) => {
    if (account.parentId === parentId) {
      children.push({
        title: <TreeRow account={account} />,
        key: account.id,
        children: buildTreeBranch(account.id, accountsById),
      });
    }
  });
  return children;
}

const Sidebar = ({ accounts, accountsView, actions }) => {
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);

  useEffect(() => {
    actions.fetchAccounts({
      fromDate: accountsView.dateRange[0],
      toDate: accountsView.dateRange[1],
    });
  }, [actions, accountsView.dateRange]);

  const treeData = buildTreeBranch(null, accounts.byId);

  const onSelectAccount = (selectedKeys, { selected }) => {
    if (selected) {
      actions.selectAccount({ id: selectedKeys[0] });
    }
  };

  const onSelectDateRange = (dates, dateStrings) => {
    actions.selectDateRange([
      dates[0].format("YYYY-MM-DD"),
      dates[1].endOf("month").format("YYYY-MM-DD"),
    ]);
  };

  const onDrop = (info) => {
    const account = accounts.byId[info.dragNode.key];
    let parentId;
    if (info.dropToGap) {
      const target = accounts.byId[info.node.key];
      parentId = target.parentId;
    } else {
      parentId = info.node.key;
    }
    actions.updateAccount({
      account,
      parentId,
    });
  };

  return (
    <div className="sidebar__container">
      <h2>Accounts</h2>
      <DatePicker.RangePicker
        picker="month"
        value={accountsView.dateRange.map((val) => moment(val))}
        onChange={onSelectDateRange}
      />
      <Tree
        treeData={treeData}
        autoExpandParent
        expandedKeys={Object.keys(accounts.byId)}
        blockNode
        showLine
        selectedKeys={[accountsView.activeTabId]}
        onSelect={onSelectAccount}
        draggable
        onDrop={onDrop}
      />
      <Button
        icon={<PlusOutlined />}
        onClick={() => setAddAccountModalOpen(true)}
      >
        Add Account
      </Button>
      <Link to="/bulk-import">
        <Button icon={<UploadOutlined />}>Import Transactions</Button>
      </Link>
      <AddAccountModal
        open={addAccountModalOpen}
        onClose={() => setAddAccountModalOpen(false)}
        accounts={accounts}
        actions={actions}
      />
    </div>
  );
};

Sidebar.propTypes = {
  accounts: PropTypes.object.isRequired,
};

export default Sidebar;
