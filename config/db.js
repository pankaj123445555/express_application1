const mongoose = require("mongoose");

const db_uri = process.env.DB_URI;

async function main() {
  await mongoose.connect(db_uri);
}

main()
  .then((data) => {
    console.log(`database connected successfully`);
  })
  .catch((err) => {
    console.log(`error while connecting to database, ${err}}`);
  });
