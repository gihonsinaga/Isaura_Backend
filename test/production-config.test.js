const assert = require("node:assert/strict");
const fs = require("node:fs");

const server = fs.readFileSync("index.js", "utf8");
const productRoutes = fs.readFileSync("routes/productRoutes.js", "utf8");
const reportRoutes = fs.readFileSync("routes/reportRoutes.js", "utf8");

assert.match(server, /app\.get\("\/health"/);
assert.match(server, /module\.exports = app/);
assert.match(productRoutes, /authenticateAdmin/);
assert.match(reportRoutes, /authenticateAdmin/);

console.log("production backend configuration checks passed");
