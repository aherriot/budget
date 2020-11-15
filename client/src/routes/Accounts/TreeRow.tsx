import React from "react";
import PropTypes from "prop-types";
import { Account } from "store/accounts";

interface Props {
  account: Account;
}

const TreeRow = ({ account }: Props) => {
  return (
    <div className="sidebar__row">
      <span>{account.name}</span>
      <span>${((account.total ?? 0) / 100).toFixed(2)}</span>
    </div>
  );
};

TreeRow.propTypes = {
  account: PropTypes.object.isRequired,
};

export default TreeRow;
