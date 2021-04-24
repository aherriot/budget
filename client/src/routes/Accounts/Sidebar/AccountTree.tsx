import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Account, AccountTreeNode } from "store/accounts";
import { Tree } from "antd";
import TreeRow from "./TreeRow";
import actions from "store/actions";
import { actions as viewActions } from "../redux/slice";

const AccountTree = () => {
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.data.accounts);
  const accountsView = useSelector((state) => state.routes.accounts);

  const onSelectAccount = (
    selectedKeys: any[],
    { selected }: { selected: boolean }
  ) => {
    if (selected) {
      dispatch(viewActions.selectAccount({ id: selectedKeys[0] }));
    }
  };

  const onDrop = (info: any) => {
    const account = accounts.byId[info.dragNode.key];
    let parentId;
    if (info.dropToGap) {
      const target = accounts.byId[info.node.key];
      parentId = target.parentId;
    } else {
      parentId = info.node.key;
    }
    dispatch(
      actions.updateAccount({
        account,
        parentId,
      })
    );
  };

  const selectedKeys = accountsView.activeTabId
    ? [accountsView.activeTabId]
    : [];

  const treeData = buildTree(null, accounts.byId, accounts.byTree);

  return (
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
  );
};

export default AccountTree;

type TreeNode = {
  title: React.ReactNode;
  key: string;
  children: TreeNode[];
};

function buildTree(
  parentId: string | null,
  accountsById: Record<string, Account>,
  accountsByTree: AccountTreeNode[]
) {
  const children: TreeNode[] = [];
  accountsByTree.forEach((account) => {
    children.push({
      title: <TreeRow account={accountsById[account.id]} />,
      key: account.id,
      children: buildTree(account.id, accountsById, account.children),
    });
  });
  return children;
}
