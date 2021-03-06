var static = require("node-static");
const db = require("better-sqlite3")("soil.db", { readonly: true });

var file = new static.Server(__dirname + "/dist");

const queries = {
  "5 Minutes": db.prepare(
    "SELECT * FROM soil ORDER BY timestamp DESC LIMIT 60"
  ),
  "1 Hour": db.prepare(
    "SELECT * FROM soil WHERE ROWID % 720 = 0 ORDER BY timestamp DESC LIMIT 60"
  ),
  "1 Day": db.prepare(
    "SELECT * FROM soil WHERE ROWID % 17280 = 0 ORDER BY timestamp DESC LIMIT 60"
  ),
  "1 Week": db.prepare(
    "SELECT * FROM soil WHERE ROWID % 12960 = 0 ORDER BY timestamp DESC LIMIT 60"
  ),
  "1 Month": db.prepare(
    "SELECT * FROM soil WHERE ROWID % 518400 = 0 ORDER BY timestamp DESC LIMIT 60"
  ),
};

const httpServer = require("http").createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url.startsWith("/data")) {
    const queryString = new URLSearchParams(req.url.split("?")[1]);
    const timeframe = queryString.get("timeframe");
    const query = queries[timeframe] || queries["5 Minutes"];
    const data = query.all();
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(data));
    return;
  }
  file.serve(req, res);
});

httpServer.listen(3000, () => {
  console.log("go to http://localhost:3000");
});
