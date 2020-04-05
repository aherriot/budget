import React from "react";
import PropTypes from "prop-types";

const TreeRow = ({ account }) => {
  return (
    <div className="sidebar__row">
      <span>{account.name}</span>
      <span>${(Math.random() * 1000).toFixed(2)}</span>
    </div>
  );
};

TreeRow.propTypes = {
  account: PropTypes.object.isRequired
};

export default TreeRow;
