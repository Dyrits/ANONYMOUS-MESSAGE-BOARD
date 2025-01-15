const mongoose = require("mongoose");

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("The connection to the database was successfully established.");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { connect };