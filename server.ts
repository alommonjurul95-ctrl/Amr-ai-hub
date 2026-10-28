import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server API Key Status
app.get('/api/status', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0 && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Available models definition
const AVAILABLE_MODELS = [
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    tag: 'Recommended',
    badge: 'Fast & Smart',
    description: 'Fastest general-purpose model with strong multilingual fluency in Bengali, Hindi, and English.',
    isDefault: true
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash Lite',
    tag: 'Ultra-Fast',
    badge: 'Lightweight',
    description: 'Extremely quick responses with lowest latency, ideal for low-bandwidth mobile connections.',
    isDefault: false
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    tag: 'Deep Reasoning',
    badge: 'Advanced',
    description: 'Flagship reasoning and STEM problem-solving model for complex prompts and code analysis.',
    isDefault: false
  }
];

app.get('/api/models', (_req, res) => {
  res.json({ models: AVAILABLE_MODELS });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, conversationHistory = [], model = 'gemini-3.8-flash', language = 'en' } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server.',
      code: 'API_KEY_MISSING',
      details: 'Please add your Google Gemini API key to the AI Studio Secrets panel or your .env file.'
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Language-specific instruction
    let langInstruction = '';
    if (language === 'bn') {
      langInstruction = `You are Amar AI Hub (আমার এআই হাব), a friendly, helpful, and highly intelligent multilingual AI assistant. 
Always respond in fluent, natural Bengali (বাংলা). If technical programming terms or specific proper nouns are clearer in English, provide them alongside clear Bengali explanation. Use warm, polite, and encouraging tone. Format answers cleanly using markdown headings, bullet points, and code blocks where applicable.`;
    } else if (language === 'hi') {
      langInstruction = `You are Amar AI Hub (अमर एआई हब), a friendly, helpful, and highly intelligent multilingual AI assistant. 
Always respond in fluent, natural Hindi (हिंदी). If technical programming terms or specific proper nouns are clearer in English, provide them alongside clear Hindi explanation. Use respectful, warm, and clear tone. Format answers cleanly using markdown headings, bullet points, and code blocks where applicable.`;
    } else {
      langInstruction = `You are Amar AI Hub, a modern, versatile, and brilliant AI companion. 
Always respond clearly, concisely, and helpfully. Structure your answers with pleasant formatting, markdown, and code blocks when appropriate. You can also understand and translate between Bengali, Hindi, and English whenever asked.`;
    }

    // Build chat history conforming to Gemini API
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Filter and sanitize recent conversation history (limit to last 14 messages to maintain mobile context performance)
    const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-14) : [];

    for (const msg of recentHistory) {
      if (msg && typeof msg.text === 'string' && msg.text.trim()) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text.trim() }]
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }]
    });

    // Selected model fallback
    const validModel = AVAILABLE_MODELS.some(m => m.id === model) ? model : 'gemini-3.8-flash';

    try {
      const response = await ai.models.generateContent({
        model: validModel,
        contents: contents,
        config: {
          systemInstruction: langInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'I received your message, but no textual response was generated.';

      return res.json({
        reply: replyText,
        model: validModel,
        language: language
      });
    } catch (modelErr: any) {
      let parsedErr = modelErr?.message || '';
      try {
        const jsonErr = JSON.parse(parsedErr);
        if (jsonErr?.error?.message) {
          parsedErr = jsonErr.error.message;
        }
      } catch {
        // keep as is
      }

      // If high demand/503 occurs and not already using lite, auto fallback to gemini-3.1-flash-lite
      if ((parsedErr.includes('high demand') || parsedErr.includes('503') || parsedErr.includes('UNAVAILABLE')) && validModel !== 'gemini-3.1-flash-lite') {
        console.warn(`Model ${validModel} experiencing high demand, falling back to gemini-3.1-flash-lite`);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: contents,
          config: {
            systemInstruction: langInstruction,
            temperature: 0.7,
          }
        });

        return res.json({
          reply: fallbackResponse.text || 'Response generated.',
          model: 'gemini-3.1-flash-lite (Fallback)',
          language: language
        });
      }
      throw modelErr;
    }

  } catch (error: any) {
    console.error('Error generating AI response:', error);
    
    // Provide user-friendly error diagnostics
    let errorMessage = error?.message || 'Unknown error occurred while contacting AI service.';
    try {
      const jsonErr = JSON.parse(errorMessage);
      if (jsonErr?.error?.message) {
        errorMessage = jsonErr.error.message;
      }
    } catch {
      // keep
    }

    let friendlyMessage = errorMessage;

    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      friendlyMessage = 'Rate limit or quota reached for this model. Please wait a few moments or switch to Gemini 3.1 Flash Lite.';
    } else if (errorMessage.includes('high demand') || errorMessage.includes('503')) {
      friendlyMessage = 'Gemini servers are currently experiencing high demand. Please try again in a few seconds or switch to Gemini 3.1 Flash Lite.';
    } else if (errorMessage.includes('API key') || errorMessage.includes('403') || errorMessage.includes('unregistered')) {
      friendlyMessage = 'Invalid or unauthorized Gemini API key. Please verify your GEMINI_API_KEY in server secrets.';
    }

    res.status(500).json({
      error: friendlyMessage,
      rawError: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Setup dev server with Vite middlewares or serve static build
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Amar AI Hub server is running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
