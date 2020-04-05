const path = require("path");
const express = require("express");

const db = require("./db");
const api = require("./api");

const app = express();

app.use("/api", api);

// Serve static assets
app.use(express.static(path.resolve(__dirname, "..", "client", "build")));

// Always return the main index.html, so react-router render the route in the client
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "..", "client", "build", "index.html")
  );
});

async function start() {
  try {
    await db.verifyConnection();
  } catch (e) {
    console.error(e);
    return;
  }

  console.log("DB connection verified");
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(
      `Server succesfully started on port ${PORT} with NODE_ENV=${process.env.NODE_ENV}.`
    );
  });
}

start();
