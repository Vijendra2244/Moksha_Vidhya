const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const ConnectToDB = mongoose.connect(process.env.MONGO_DB_URI);

module.exports = {
  ConnectToDB,
};
