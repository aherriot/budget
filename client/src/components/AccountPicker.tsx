import React from "react";
import { useSelector } from "react-redux";
import { Cascader } from "antd";
import { Account } from "store/accounts";

interface Props {
  value: any;
  onChange: () => void;
}

const AccountPicker = ({ value, onChange }: Props) => {
  const accounts = useSelector((state) => state.data.accounts);
  const options = buildAcountsTree(null, accounts.byId);
  return (
    <Cascader
      showSearch={{
        filter,
        matchInputWidth: false,
      }}
      // defaultValue={[options[0].value]}
      allowClear={false}
      value={value}
      options={options}
      displayRender={displayRender}
      onChange={onChange}
      changeOnSelect
    />
  );
};

export default AccountPicker;

function displayRender(val: string[]) {
  return val[val.length - 1];
}

function filter(searchValue: string, path: any[]) {
  return !!(path[path.length - 1].label as string)
    .toLowerCase()
    .includes(searchValue.toLowerCase());
}

interface TreeNode {
  label: string;
  value: string;
  children: TreeNode[];
}
function buildAcountsTree(
  parentId: string | null,
  accountsById: Record<string, Account>
) {
  const children: TreeNode[] = [];
  Object.values(accountsById).forEach((account) => {
    if (account.parentId === parentId) {
      children.push({
        label: accountsById[account.id]?.name,
        value: account.id,
        children: buildAcountsTree(account.id, accountsById),
      });
    }
  });
  return children;
}
