const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

async function connectMDB() {
  if (!process.env["MONGO_DB_URL"]) {
    console.error("MONGO_DB_URL environment variable is not defined");
    return false;
  }

  try {
    await mongoose.connect(process.env["MONGO_DB_URL"], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected MongoDB");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = connectMDB;
