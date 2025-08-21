# AI Resume Analyzer

A modern, professional resume analysis tool powered by Groq AI that provides detailed feedback and actionable insights to improve your resume.

## Features

- **AI-Powered Analysis**: Uses Groq's fast LLaMA models for intelligent resume analysis
- **Modern UI**: Clean, responsive design with professional styling
- **File Upload**: Support for drag-and-drop file uploads (TXT files)
- **Real-time Feedback**: Instant validation and error handling
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during analysis
- **Keyboard Shortcuts**: Ctrl/Cmd + Enter to analyze
- **Typewriter Effect**: Animated display of analysis results

## Setup Instructions

### 1. Get Your Free Groq API Key

1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account
3. Create a new API key
4. Copy the API key for the next step

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and replace `YOUR_GROQ_API_KEY` with your actual API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=5000
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Application

**Option A: Quick Start (Recommended)**
```bash
npm run setup
```
This will automatically check your configuration and start the server.

**Option B: Manual Start**
```bash
npm start
```

The server will start on `http://localhost:3333`

### 5. Access the Application

Once the server is running, you have two options:

**Option A: Use the built-in web interface (Recommended - No CORS issues)**
- Open your browser and go to: `http://localhost:3333/index.html`

**Option B: Serve the HTML file separately**
- Open `index.html` directly in your browser, or
- Use a local web server:
  ```bash
  # Using Python (if installed)
  python -m http.server 8080

  # Using Node.js http-server (install globally first: npm install -g http-server)
  http-server -p 8080
  ```
  Then navigate to `http://localhost:8080`

## Usage

1. **Upload or Paste Resume**: 
   - Drag and drop a TXT file into the upload area, or
   - Click the upload area to browse for files, or
   - Paste your resume text directly into the textarea

2. **Analyze**: 
   - Click the "Analyze Resume" button, or
   - Use the keyboard shortcut Ctrl/Cmd + Enter

3. **Review Results**: 
   - The AI analysis will appear in the right panel with a typewriter effect
   - Review the feedback and suggestions provided

## Technical Details

### Backend (server.js)
- **Framework**: Express.js
- **AI Provider**: Groq AI (using groq-sdk)
- **Model**: llama-3.1-8b-instant (fast, production-ready)
- **Environment**: Node.js with dotenv for configuration

### Frontend (index.html)
- **Styling**: Modern CSS with CSS Grid and Flexbox
- **Responsive**: Mobile-first design with breakpoints
- **Interactions**: Vanilla JavaScript with modern ES6+ features
- **Animations**: CSS transitions and JavaScript typewriter effect
- **Accessibility**: ARIA labels and keyboard navigation

### Dependencies
- `express`: Web server framework
- `groq-sdk`: Official Groq AI SDK
- `cors`: Cross-origin resource sharing
- `body-parser`: Request body parsing
- `dotenv`: Environment variable management

## API Endpoints

### POST /analyze
Analyzes the provided resume text and returns AI-generated feedback.

**Request Body:**
```json
{
  "resumeText": "Your resume content here..."
}
```

**Response:**
```json
{
  "analysis": "Detailed AI analysis and suggestions..."
}
```

**Error Response:**
```json
{
  "error": "Error analyzing resume",
  "message": "Detailed error message"
}
```

## Customization

### Changing the AI Model
Edit `server.js` and modify the model parameter:
```javascript
const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile", // Change to any supported Groq model
  // ... other parameters
});
```

### Styling Customization
The CSS uses CSS custom properties (variables) defined in the `:root` selector. You can easily customize colors, fonts, and spacing by modifying these variables.

### Adding File Type Support
Currently supports TXT files. To add PDF/DOC support, you would need to integrate a file parsing library like `pdf-parse` or `mammoth`.

## Troubleshooting

### Common Issues

1. **"Failed to analyze resume" Error**
   - Check if the server is running (`node server.js`)
   - Verify your Groq API key is correctly set in `.env`
   - Check the browser console for detailed error messages

2. **CORS Errors**
   - Make sure you're accessing the frontend through a web server, not file://
   - The server includes CORS headers to allow cross-origin requests

3. **File Upload Not Working**
   - Currently only TXT files are fully supported
   - For PDF/DOC files, copy and paste the text content instead

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.
