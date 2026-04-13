const express = require('express');
const router = express.Router();
const axios = require("axios");

async function callAI(prompt) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content: "You are an expert Agile product manager."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    },
    {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = response.data.choices[0].message.content;

  return text.replace(/```json|```/g, "").trim();
}

router.post('/acceptance-criteria', async (req, res) => {
  const { title, description } = req.body;

  try {
    const text = await callAI(`
Generate 3-5 concise acceptance criteria.

Return ONLY JSON:
{ "criteria": ["criterion 1", "criterion 2"] }

Title: ${title}
Description: ${description}
    `);

    res.json(JSON.parse(text));
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

router.post('/suggest-priority', async (req, res) => {
  const { title, description } = req.body;

  try {
    const text = await callAI(`
Suggest priority.

Return ONLY JSON:
{ "priority": "High|Medium|Low", "reason": "short explanation" }

Title: ${title}
Description: ${description}
    `);

    res.json(JSON.parse(text));
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "AI failed" });
  }
});

router.post('/estimate-complexity', async (req, res) => {
  const { title, description } = req.body;
  try {
    const text = await callAI(
      `You are an experienced agile software engineer doing sprint planning.
Analyse this backlog ticket and estimate its complexity using Fibonacci story points (1, 2, 3, 5, 8, 13, 21).

Rules:
- 1-2: trivial change, well understood, no unknowns
- 3-5: moderate complexity, some research or coordination needed
- 8-13: complex, multiple components or significant unknowns
- 21: very large, should be broken down into smaller tickets

Return ONLY a JSON object:
{ "points": <number>, "reasoning": "2-3 sentence explanation of why you chose this estimate", "suggestion": "optional string — if points >= 13, suggest how to break it down, otherwise null" }

Title: ${title}
Description: ${description}`
    );
    res.json(JSON.parse(text));
  } catch (err) {
    console.error('Complexity Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;