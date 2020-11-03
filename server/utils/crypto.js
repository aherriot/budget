const crypto = require("crypto");

module.exports = {
  kdf: function (password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(8).toString("hex");
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ":" + derivedKey.toString("hex"));
      });
    });
  },

  verify: function (password, hash) {
    return new Promise((resolve, reject) => {
      const [salt, key] = hash.split(":");
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key === derivedKey.toString("hex"));
      });
    });
  },
};
