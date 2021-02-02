const path = require("path");
const { MONGO_CONNECT_URL, NODE_ENV } = process.env;

const entities =
  NODE_ENV === "dev"
    ? [path.join(__dirname, "src", "infra", "db", "entities/*.ts")]
    : [path.join(__dirname, "dist", "infra", "db", "entities/*.js")];

module.exports = {
  name: "default",
  type: "mongodb",
  url: MONGO_CONNECT_URL,
  entities,
  useUnifiedTopology: true,
};
