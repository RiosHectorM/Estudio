const { TIMESTAMP } = require("mysql/lib/protocol/constants/types");
const { format } = require("timeago.js");

const helpers = {};

helpers.timeago = (timestamp) => {
  return format(timestamp);
};

module.exports = helpers;
