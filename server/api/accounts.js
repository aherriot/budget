const Router = require("express-promise-router");
const db = require("../db");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`select * from accounts;`);
    return res.send({
      data: result.rows.map(convertDbRecordToResult)
    });
  } catch (e) {
    return res.status(500).json();
    // return processError(e, res)
  }
});

const convertDbRecordToResult = row => ({
  id: row.id.toString(),
  parent_id: row.parent_id ? row.parent_id.toString() : null,
  type: row.type,
  name: row.name
});

module.exports = router;
