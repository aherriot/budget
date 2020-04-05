const Router = require("express-promise-router");
const bodyParser = require("body-parser");

const accounts = require("./accounts");
const transactions = require("./transactions");
// const users = require('./users')
// const errors = require('./errors')

const router = new Router();
router.use(bodyParser.json());

router.use("/accounts", accounts);
router.use("/transactions", transactions);
// router.use('/users', users)
// router.use('/errors', errors)

module.exports = router;
