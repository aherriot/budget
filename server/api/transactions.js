const fs = require("fs");
const Router = require("express-promise-router");
const db = require("../db");
const transactionsQuery = fs.readFileSync("api/transactions.sql").toString();

const router = Router();

router.post("/", async (req, res) => {
  try {
    const result = await insertTransaction(req.body.data);
    return res
      .status(200)
      .json({ data: convertDbRecordToResult(result.rows[0]) });
  } catch (e) {
    return res.status(500).json({ message: "Unable to insert record" });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const promises = req.body.data.map(insertTransaction);

    const results = await Promise.all[promises];

    res
      .status(200)
      .json({ data: results.map((r) => convertDbRecordToResult(r.rows[0])) });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Unable to insert records" });
  }
});

router.post("/search", async (req, res) => {
  try {
    const result = await db.query(transactionsQuery, [1, req.body.accountId]);
    return res.send({
      data: result.rows.map(convertDbRecordToResult),
    });
  } catch (e) {
    return res.status(500).json();
    // return processError(e, res)
  }
});

const insertTransaction = (transaction) => {
  return db.query(
    `insert into transactions 
    (amount, description, out_account, out_date, in_account, in_date )
    values
    ($1, $2, $3, $4, $5, $6)
    returning *;`,
    [
      transaction.amount,
      transaction.description,
      transaction.outAccount,
      transaction.outDate,
      transaction.inAccount,
      transaction.inDate,
    ]
  );
};

const convertDbRecordToResult = (row) => ({
  id: row.id.toString(),
  amount: row.amount,
  description: row.description,
  outDate: row.out_date,
  outAccount: row.out_account.toString(),
  inDate: row.in_date,
  inAccount: row.in_account.toString(),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

module.exports = router;
