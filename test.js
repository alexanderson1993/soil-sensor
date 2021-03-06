const db = require("better-sqlite3")("soil.db");

db.prepare(
  "CREATE TABLE IF NOT EXISTS soil (timestamp TEXT, temp REAL, moisture REAL)"
).run();

const wait = (time) => new Promise((r) => setTimeout(r, time));
(async function () {
  while (true) {
    db.prepare(
      "INSERT INTO soil (timestamp, temp, moisture) VALUES (?, ?, ?)"
    ).run(
      new Date().toISOString(),
      Math.random() * 5 + 20,
      Math.random() * 400 * 300
    );
    await wait(5000);
  }
})();
