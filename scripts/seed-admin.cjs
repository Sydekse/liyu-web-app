require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  const mongoUri = process.env.MONGODB_URI;
  const userName = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing");
  }
  if (!userName || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set");
  }

  await mongoose.connect(mongoUri, {
    dbName: "Liyu-catering",
  });

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await mongoose.connection.collection("admins").updateOne(
    { userName },
    {
      $set: {
        userName,
        password: hashedPassword,
      },
    },
    { upsert: true },
  );

  const action = result.upsertedCount > 0 ? "created" : "updated";
  console.log(`Admin "${userName}" ${action}.`);

  await mongoose.disconnect();
}

seedAdmin().catch((error) => {
  console.error("Failed to seed admin:", error.message);
  process.exit(1);
});
