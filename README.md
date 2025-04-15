
---

## 🚀 Features

- ✅ Voice-enabled and text chat interface
- ✅ Drop-down user selection for context
- ✅ Semantic search using `pgvector` over financial documents
- ✅ Contextually aware answers to queries like:
  - *"How much did I spend on food in January?"*
  - *"Summarize my top 3 transactions last month"*
  - *"Any unusual spends in March?"*
- ✅ Safe, relevant, and personalized AI responses via MCP

---

## 📁 Project Structure


---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/seethb/Finassistant.git
cd Finassistant



2. Install dependencies

npm install

3. Set up your .env file

OPENAI_API_KEY=sk-...
PG_CONN=postgresql://username:password@localhost:5433/dbname
PORT=3001

4. Seed sample data
Ensure transactions and documents tables exist in YugabyteDB. Then:

node seed-doc.js
Or, to bulk-insert dummy transactions:

python load_transactions.py

5. Run the backend

node server.js
It runs on: http://localhost:3001

🖥️ Using the App
Open public/index.html in your browser.

Choose a user (e.g., User 4).

Type or speak your financial query.

Get a natural language response from the AI.

🤖 How MCP Works
MCP Client: The Node.js backend constructs a rich context prompt with user info, preferences, and recent transactions.

MCP Server: OpenAI processes the structured input and returns a contextually aware response.

Vector Search: Top-k relevant docs are retrieved using pgvector similarity search on documents.

💡 Sample Queries
"What did I spend in March 2024?"

"How much did I spend on shopping last month?"

"Summarize my last 3 transactions and flag unusual ones"

"Show all Amazon purchases over $200"

🧠 Technologies Used
Component	Technology
Database	YugabyteDB
Vector Search	pgvector extension
LLM API	OpenAI GPT-3.5
Frontend	HTML + JavaScript
Backend	Node.js + Express
Embeddings	text-embedding-ada-002
Protocol	Model Context Protocol (MCP)

🧪 Example Output

You: What did I spend on food in January?
AI: Based on the transaction history, there are no food transactions in January. The closest is a food-related transaction at Apple on March 9 for $221.67.



