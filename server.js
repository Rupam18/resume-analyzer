require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

// Configure CORS to allow requests from different origins
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'file://', // For direct file access
    null // For direct file access
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Initialize Groq with your API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "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",  // Replace with your real API key
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} from ${req.get('origin') || 'unknown'}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Resume analysis endpoint
app.post("/analyze", async (req, res) => {
  try {
    console.log('Received analyze request');
    const { resumeText } = req.body;

    // Validate input
    if (!resumeText || typeof resumeText !== 'string') {
      return res.status(400).json({
        error: "Invalid input",
        message: "Resume text is required and must be a string"
      });
    }

    if (resumeText.trim().length < 10) {
      return res.status(400).json({
        error: "Invalid input",
        message: "Resume text must be at least 10 characters long"
      });
    }

    console.log('Sending request to Groq AI...');
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",  // Using a fast, production-ready Groq model
      messages: [
        {
          role: "system",
          content: `You are a professional resume analyzer and career consultant. Provide detailed, actionable feedback in well-formatted markdown.

IMPORTANT: Format your response using proper markdown syntax:
- Use ## for main sections (e.g., ## Overall Assessment, ## Strengths, ## Areas for Improvement)
- Use ### for subsections
- Use **bold** for important points
- Use bullet points (-) for lists
- Use numbered lists (1.) for step-by-step recommendations
- Use *italics* for emphasis
- Keep paragraphs concise and well-structured

Analyze the resume comprehensively covering: overall assessment, strengths, areas for improvement, specific recommendations, and formatting suggestions.`
        },
        {
          role: "user",
          content: `Please analyze this resume and provide detailed feedback with actionable suggestions for improvement:\n\n${resumeText}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    console.log('Received response from Groq API');
    res.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    console.error("Error analyzing resume:", error);

    // Handle specific Groq API errors
    if (error.status === 401) {
      return res.status(500).json({
        error: "API Authentication Error",
        message: "Invalid or missing Groq API key. Please check your configuration."
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate Limit Exceeded",
        message: "Too many requests. Please try again later."
      });
    }

    res.status(500).json({
      error: "Error analyzing resume",
      message: error.message || "Unknown error occurred"
    });
  }
});

// Start server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log('🚀 Resume Analyzer Server Started!');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Web interface: http://localhost:${PORT}/index.html`);
  console.log(`🔑 API Key status: ${process.env.GROQ_API_KEY ? '✅ Configured' : '❌ Missing - check .env file'}`);
  console.log('📋 Available endpoints:');
  console.log(`   GET  /health - Server health check`);
  console.log(`   POST /analyze - Resume analysis`);
  console.log(`   GET  /index.html - Web interface`);
  console.log('');
});
