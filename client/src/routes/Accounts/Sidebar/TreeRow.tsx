import React from "react";
import PropTypes from "prop-types";
import { Account } from "store/accounts";
import formatCurrency from "utils/formatCurrency";
import ColorDot from "components/ColorDot";
interface Props {
  account: Account;
}

const TreeRow = ({ account }: Props) => {
  return (
    <div className="sidebar__row">
      <span className="sidebar__label">
        <ColorDot color={account.color as string} />
        <span>{account.name}</span>
      </span>
      <span>{formatCurrency(account.total ?? 0)}</span>
    </div>
  );
};

TreeRow.propTypes = {
  account: PropTypes.object.isRequired,
};

export default TreeRow;
