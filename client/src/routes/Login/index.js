import React, { useState } from "react";
// import PropTypes from "prop-types";

const Login = (props) => {
  const [val, setVal] = useState(0);

  return (
    <div>
      Login View: {val}
      <h1 onClick={() => setVal(val + 1)}>val: {val}</h1>
    </div>
  );
};

Login.propTypes = {};

export default Login;
