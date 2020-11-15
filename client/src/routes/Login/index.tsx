import React, { useState } from "react";

const Login = () => {
  const [val, setVal] = useState(0);

  return (
    <div>
      Login View: {val}
      <h1 onClick={() => setVal(val + 1)}>val: {val}</h1>
    </div>
  );
};

export default Login;
