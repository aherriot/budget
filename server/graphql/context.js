const jwt = require("jsonwebtoken");

module.exports = ({ req }) => {
  let user;
  let token = req.headers.authorization;
  if (token) {
    token = token.replace("Bearer ", "");

    // verifies secret and checks exp
    jwt.verify(token, config.jwtSecret, function (err, decoded) {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return;
          // return respondWithError(res, "TokenExpiredError");
        } else {
          return;
          // return respondWithError(res, "JsonWebTokenError");
        }
      }

      user = {
        id: decoded.id,
        username: decoded.username,
      };
    });
  }
  return { user };
};
