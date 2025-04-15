require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pgClient = new Client({ connectionString: process.env.PG_CONN });
pgClient.connect();

app.post('/chat', async (req, res) => {
  const { userId, message } = req.body;
  console.log('💬 /chat hit with:', { userId, message });

  try {
    // 🔍 Log raw response to debug OpenAI output
    const embedRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: message,
    });

    console.log("📦 Embedding Response:", JSON.stringify(embedRes, null, 2));

    const embeddingData = embedRes.data?.[0]?.embedding;

    if (!embeddingData) throw new Error("No embedding returned from OpenAI");

    const vector = `[${embeddingData.join(',')}]`;

    const memRes = await pgClient.query(
      `SELECT content FROM documents WHERE user_id = $1 ORDER BY embedding <-> $2 LIMIT 5`,
      [userId, vector]
    );

    const memory = memRes.rows.map(r => r.content).join('\n');

    const userRes = await pgClient.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    const user = userRes.rows[0] || { name: 'Guest', preferences: {} };

    const finalPrompt = `
You are a helpful financial assistant.

User: ${user.name}
Preferences: ${JSON.stringify(user.preferences)}

Transaction History:
${memory}

Question: ${message}
    `;

    const chatRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: finalPrompt }],
    });

    const reply = chatRes?.choices?.[0]?.message?.content;
    res.json({ reply });

  } catch (err) {
    console.error('❌ Error in /chat:', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
