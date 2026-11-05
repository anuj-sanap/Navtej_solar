// Script to set admin password in MongoDB
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const MONGODB_URI = "mongodb://127.0.0.1:27017/navtej_solar";
const ADMIN_EMAIL = "piyushswarge0@gmail.com";
const NEW_PASSWORD = "Navtej@26";

async function setAdminPassword() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db("navtej_solar");
    const users = db.collection("users");

    // Check if admin user exists
    const admin = await users.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (!admin) {
      console.log("⚠️  Admin user not found. Creating admin account...");

      const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);
      await users.insertOne({
        name: "Navtej Admin",
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role: "owner",
        phone: "9403277273",
        address: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✅ Admin account created!`);
      console.log(`   Email   : ${ADMIN_EMAIL}`);
      console.log(`   Password: ${NEW_PASSWORD}`);
      console.log(`   Role    : owner`);
    } else {
      // Update existing admin's password
      const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);
      await users.updateOne(
        { email: ADMIN_EMAIL.toLowerCase() },
        {
          $set: {
            passwordHash,
            role: "owner",          // ensure owner role
            updatedAt: new Date(),
          },
        }
      );

      console.log(`✅ Admin password updated successfully!`);
      console.log(`   Email   : ${ADMIN_EMAIL}`);
      console.log(`   Password: ${NEW_PASSWORD}`);
      console.log(`   Role    : owner`);
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

setAdminPassword();

