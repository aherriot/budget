import React from "react";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = (props) => {
  return (
    <div className="header__container">
      <Link to="/">
        <h2>Budget</h2>
      </Link>
    </div>
  );
};

Header.propTypes = {};

export default Header;
