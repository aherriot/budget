import React, { useState, useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Tree, Button, DatePicker } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import actions from "store/actions";
import { Account } from "store/accounts";
import TreeRow from "./TreeRow";
import { actions as viewActions } from "./redux/slice";

import "./Sidebar.css";
import AddAccountModal from "./AddAccountModal";

type TreeNode = {
  title: ReactNode;
  key: string;
  children: TreeNode[];
};

function buildTreeBranch(
  parentId: string | null,
  accountsById: Record<string, Account>
) {
  const children: TreeNode[] = [];
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

// interface Props {

// }

const Sidebar = () => {
  const accounts = useSelector((state) => state.data.accounts);
  const accountsView = useSelector((state) => state.routes.accounts);
  const dispatch = useDispatch();
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);

  useEffect(() => {
    dispatch(
      actions.fetchAccounts({
        fromDate: accountsView.dateRange[0],
        toDate: accountsView.dateRange[1],
      })
    );
  }, [dispatch, accountsView.dateRange]);

  const treeData = buildTreeBranch(null, accounts.byId);

  const onSelectAccount = (
    selectedKeys: any[],
    { selected }: { selected: boolean }
  ) => {
    if (selected) {
      dispatch(viewActions.selectAccount({ id: selectedKeys[0] }));
    }
  };

  const onSelectDateRange = (dates: any) => {
    dispatch(
      viewActions.selectDateRange([
        dates[0].format("YYYY-MM-DD"),
        dates[1].endOf("month").format("YYYY-MM-DD"),
      ])
    );
  };

  // type DropInfo = NodeDragEventParams<HTMLDivElement> & {
  //   dragNode: EventDataNode;
  //   dragNodesKeys: React.ReactText[];
  //   dropPosition: number;
  //   dropToGap: boolean;
  // };

  const onDrop = (info: any) => {
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

  const selectedKeys = accountsView.activeTabId
    ? [accountsView.activeTabId]
    : [];

  return (
    <div className="sidebar__container">
      <h2>Accounts</h2>
      <DatePicker.RangePicker
        picker="month"
        value={accountsView.dateRange.map((val) => moment(val)) as any}
        onChange={onSelectDateRange}
      />
      <Tree
        treeData={treeData}
        autoExpandParent
        expandedKeys={Object.keys(accounts.byId)}
        blockNode
        showLine
        selectedKeys={selectedKeys}
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
      />
    </div>
  );
};

export default Sidebar;
