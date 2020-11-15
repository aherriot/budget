const fs = require("fs");
const Router = require("express-promise-router");
const db = require("../db");
const transactionsQuery = fs.readFileSync("api/transactions.sql").toString();

const router = Router();

router.post("/", async (req, res) => {
  const { transaction } = req.body;

  if (!transaction) {
    return res.status(400).json({ error: "transaction is required" });
  } else if (!transaction.inAccount) {
    return res.status(400).json({ error: "inAccount is required" });
  } else if (!transaction.outAccount) {
    return res.status(400).json({ error: "outAccount is required" });
  } else if (!transaction.inDate) {
    return res.status(400).json({ error: "inDate is required" });
  } else if (!transaction.outDate) {
    return res.status(400).json({ error: "outDate is required" });
  } else if (!transaction.amount) {
    return res.status(400).json({ error: "amount is required" });
  } else if (!transaction.description) {
    return res.status(400).json({ error: "description is required" });
  }

  try {
    const result = await insertTransaction(transaction);
    return res
      .status(200)
      .json({ data: convertDbRecordToResult(result.rows[0]) });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Unable to insert record", error: e });
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
    const result = await db.query(transactionsQuery, [
      1,
      req.body.accountId,
      req.body.fromDate,
      req.body.toDate,
    ]);
    return res.json({
      data: result.rows.map(convertDbRecordToResult),
    });
  } catch (e) {
    return res.status(500).json();
  }
});

router.delete("/:transactionId", async (req, res) => {
  const userId = 1;
  try {
    const result = await db.query(
      `delete from transactions t
      using accounts in_account, accounts out_account
      where  
          (t.in_account = in_account.id and in_account.user_id = $2)
          and (t.out_account = out_account.id and out_account.user_id = $2)
          and t.id = $1;`,
      [parseInt(req.params.transactionId, 10), userId]
    );

    if (result.rowCount > 0) {
      return res.json({ success: true });
    } else {
      return res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    return res.status(500).json({ error });
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
  outAmount: row.out_amount,
  inAmount: row.in_amount,
  description: row.description,
  outDate: row.out_date,
  outAccount: row.out_account.toString(),
  inDate: row.in_date,
  inAccount: row.in_account.toString(),
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

module.exports = router;
