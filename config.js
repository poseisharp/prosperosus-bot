const fs = require("fs");

if (process.env.CONFIG_JSON) {
  module.exports = JSON.parse(process.env.CONFIG_JSON);
} else {
  module.exports = require("./config.json");
}
