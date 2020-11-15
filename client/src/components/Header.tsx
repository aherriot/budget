import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header__container">
      <Link to="/">
        <h2>Budget</h2>
      </Link>
    </div>
  );
};

export default Header;
