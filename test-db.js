import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL, // uses your .env file
  ssl: {
    rejectUnauthorized: false, // required for Supabase
  },
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected successfully!");
    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection error:", err.message);
  } finally {
    await client.end();
  }
}

testConnection();
