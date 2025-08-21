#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Resume Analyzer Setup & Start Script');
console.log('=====================================\n');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found!');
  console.log('📝 Creating .env file from template...');
  
  try {
    const envExample = fs.readFileSync('.env.example', 'utf8');
    fs.writeFileSync('.env', envExample);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please edit .env file and add your Groq API key before continuing.');
    console.log('🔑 Get your free API key from: https://console.groq.com/keys\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

// Check if API key is configured
const envContent = fs.readFileSync('.env', 'utf8');
const hasApiKey = envContent.includes('gsk_') || !envContent.includes('YOUR_GROQ_API_KEY');

if (!hasApiKey) {
  console.log('⚠️  Groq API key not configured in .env file');
  console.log('🔑 Please edit .env file and add your Groq API key');
  console.log('🔗 Get your free API key from: https://console.groq.com/keys\n');
}

// Start the server
console.log('🚀 Starting Resume Analyzer server...\n');

const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`\n📊 Server process exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.kill('SIGTERM');
  process.exit(0);
});
