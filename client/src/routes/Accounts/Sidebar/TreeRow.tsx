import React from "react";
import PropTypes from "prop-types";
import { Account } from "store/accounts";
import formatCurrency from "utils/formatCurrency";

interface Props {
  account: Account;
}

const TreeRow = ({ account }: Props) => {
  return (
    <div className="sidebar__row">
      <span>{account.name}</span>
      <span>{formatCurrency(account.total ?? 0)}</span>
    </div>
  );
};

TreeRow.propTypes = {
  account: PropTypes.object.isRequired,
};

export default TreeRow;
