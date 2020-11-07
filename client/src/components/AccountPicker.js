import React from "react";
import { Cascader } from "antd";

const AccountPicker = ({ accounts, onChange, defaultValue }) => {
  const options = buildAcountsTree(null, accounts, []);
  return (
    <Cascader
      showSearch={{
        filter,
      }}
      // defaultValue={[options[0].value]}
      options={options}
      displayRender={displayRender}
      onChange={onChange}
      changeOnSelect
    />
  );
};

export default AccountPicker;

function displayRender(val) {
  return val[val.length - 1];
}

function filter(searchValue, path) {
  return path[path.length - 1].label
    .toLowerCase()
    .includes(searchValue.toLowerCase());
}

function buildAcountsTree(parentId, accounts, path) {
  const children = [];
  Object.values(accounts.byId).forEach((account) => {
    if (account.parentId === parentId) {
      children.push({
        label: accounts.byId[account.id]?.name,
        value: account.id,
        children: buildAcountsTree(account.id, accounts, [...path, account.id]),
      });
    }
  });
  return children;
}
