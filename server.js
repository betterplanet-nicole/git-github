import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY. Add it to your environment or .env file.');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json({ limit: '15mb' }));
app.use(express.static('public'));

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, imageDataUrl, evaluationParameters } = req.body;

    if (!message && !imageDataUrl) {
      return res.status(400).json({ error: 'Please provide a message or image.' });
    }

    const parameterText =
      typeof evaluationParameters === 'string'
        ? evaluationParameters
        : JSON.stringify(evaluationParameters || {}, null, 2);

    const input = [
      {
        role: 'system',
        content:
          'You are BetterPlanet\'s customer-facing assistant. Be concise, helpful, and practical. When an image is supplied, evaluate it against the provided parameters and explain your reasoning in plain language.'
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `User message: ${message || '(no text message)'}\n\nEvaluation parameters:\n${parameterText}`
          }
        ]
      }
    ];

    if (imageDataUrl) {
      input[1].content.push({
        type: 'input_image',
        image_url: imageDataUrl
      });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input
    });

    res.json({
      reply: response.output_text || 'I could not generate a response. Please try again.'
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Something went wrong while contacting OpenAI.',
      details: error?.message
    });
  }
});

app.listen(port, () => {
  console.log(`OpenAI-Chatbot running on http://localhost:${port}`);
});
