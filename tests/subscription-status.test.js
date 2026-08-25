const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function runPageScript(search) {
  const elements = {
    year: { textContent: "" },
    "form-status": { className: "form-status", textContent: "" }
  };

  const document = {
    addEventListener(event, callback) {
      if (event === "DOMContentLoaded") callback();
    },
    getElementById(id) {
      return elements[id] ?? null;
    },
    querySelectorAll() {
      return [];
    }
  };

  const source = fs.readFileSync(
    path.join(__dirname, "..", "script.js"),
    "utf8"
  );

  vm.runInNewContext(source, {
    document,
    window: { location: { search } },
    URLSearchParams,
    Date
  });

  return elements["form-status"];
}

const confirmed = runPageScript("?subscription=confirmed");
assert.equal(confirmed.className, "form-status is-success");
assert.match(confirmed.textContent, /confirmada/i);

const unknown = runPageScript("?subscription=anything-else");
assert.equal(unknown.className, "form-status");
assert.equal(unknown.textContent, "");

console.log("subscription-status: ok");
