const fs = require("fs");
const Router = require("express-promise-router");
const db = require("../db");

const accountsTreeQuery = fs.readFileSync("api/accountsTree.sql").toString();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`select * from accounts;`);
    return res.send({
      data: result.rows.map(convertDbRecordToResult),
    });
  } catch (e) {
    return res.status(500).json();
    // return processError(e, res)
  }
});

router.get("/:accountId", async (req, res) => {
  try {
    const result = await db.query(`select * from accounts where id = $1;`, [
      req.params.accountId,
    ]);

    if (result.rows.length === 0) {
      res.send(404).json({ message: "account not found" });
    }
    return res.send({
      data: result.rows.map(convertDbRecordToResult)[0],
    });
  } catch (e) {
    return res.status(500).json();
    // return processError(e, res)
  }

  return;
});

router.patch("/:accountId", async (req, res) => {
  const { parentId } = req.body;
  try {
    if (parentId != null) {
      // check if parent exists and is owned by user
      const result = await db.query(
        `select * from accounts where id = $1 and user_id = $2;`,
        [parentId, 1]
      );

      if (result.rows.length === 1) {
        const result = await db.query(
          "update accounts set parent_id = $2 where id = $1;",
          [req.params.accountId, parentId]
        );

        return res.json(result.rows.length);
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
    // return processError(e, res)
  }

  return res.status(400).json({ message: "no change" });
});

router.post("/", async (req, res) => {
  try {
    const result = await db.query(
      `
    insert into accounts 
    (parent_id, type, user_id, name) 
    values ($1, $2, $3, $4)
    returning *;`,
      [req.body.parentId, req.body.type, 1, req.body.name]
    );
    return res.json({ data: convertDbRecordToResult(result.rows[0]) });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
});

router.post("/tree", async (req, res) => {
  try {
    const result = await db.query(accountsTreeQuery, [
      req.body.fromDate,
      req.body.toDate,
    ]);

    return res.send({
      data: result.rows.map(convertDbRecordToResult),
    });
  } catch (e) {
    return res.status(500).json({ error: e });
    // return processError(e, res)
  }
});

const convertDbRecordToResult = (row) => ({
  id: row.id.toString(),
  parentId: row.parent_id ? row.parent_id.toString() : null,
  type: row.type,
  name: row.name,
  total: row.total != null ? parseInt(row.total, 10) : null,
});

module.exports = router;
