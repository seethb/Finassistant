require('dotenv').config();
const OpenAI = require("openai");
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

async function seed() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT id, user_id, amount, merchant, category, txn_date 
      FROM transactions 
      ORDER BY txn_date DESC 
      LIMIT 1000
    `);

    for (const row of result.rows) {
      const docText = `User ${row.user_id} spent $${row.amount} at ${row.merchant} on ${row.txn_date} for ${row.category}`;
      const embedding = await generateEmbedding(docText);
      const vector = `[${embedding.join(',')}]`;

      await client.query(
        `INSERT INTO documents (user_id, content, embedding, txn_date)
         VALUES ($1, $2, $3, $4)`,
        [row.user_id, docText, vector, row.txn_date]  // row.txn_date is already a DATE
      );
      

      console.log(`Inserted for user ${row.user_id}: ${docText}`);
    }
  } catch (err) {
    console.error("Error generating embeddings", err);
  } finally {
    client.release();
  }
}

seed();
