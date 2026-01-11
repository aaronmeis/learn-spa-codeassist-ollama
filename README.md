# Self-Improving Coding Agent MVP

A browser-based learning project that demonstrates how to build an autonomous coding assistant using local LLM inference (Ollama). This MVP explores agentic AI concepts through a phased approach, featuring real-time code generation, streaming, token tracking, and interactive help.

![Overview](./unnamed9.png)

**🎓 Learning Project** | **🚀 MVP Status** | **🔧 Phase 1 Complete**

> **Current Phase: 1 - Hello Ollama**  
> Basic LLM integration with health checks, logging, real-time streaming, and interactive UI.

> **🌐 Landing Page:** Check out [index.html](./index.html) for an overview and demo!

## What It Does

Describe coding goals in natural language, and the app generates JavaScript code using a local Ollama instance. Code streams in real-time as it's generated, with comprehensive token tracking, health monitoring, and debug tools for learning.

## 🚀 Quick Start

> **📖 New to the project?** See [SETUP.md](./SETUP.md) for detailed step-by-step setup instructions.

### Prerequisites

- **Node.js** 18+ and npm
- **Ollama** installed and running locally

### 1. Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: Download from https://ollama.com/download
```

### 2. Pull the Code Model

```bash
ollama pull phi3:latest
```

This downloads ~2.2GB. The app uses `phi3:latest` by default (optimized for laptops).

**Alternative models:**
- `llama3.2:latest` (~2GB) - General purpose
- `codellama:7b` (~4GB) - Larger, more capable for code generation
- `tinyllama` (~637MB) - Smallest, fastest, but less capable

### 3. Start Ollama Server

```bash
ollama serve
```

Keep this running in a separate terminal.

### 4. Install and Run the App

```bash
cd my-agent-app    # Navigate to the app directory
npm install        # Install dependencies
npm run dev        # Start development server
```

Open http://localhost:5173 in your browser.

> **Note:** All npm commands should be run from the `my-agent-app` directory. See [SETUP.md](./SETUP.md) for detailed instructions.

## 📖 Usage

1. **Check System Status** - The health panel shows if Ollama is connected
2. **Enter a Goal** - Describe what code you want (or use an example)
3. **Generate Code** - Click the button to send to Ollama
4. **View Results** - See generated code stream in real-time in the Monaco editor
5. **Monitor Tokens** - Token usage is displayed in the bottom-right corner after generation
6. **Debug** - Expand the debug panel to see raw prompts/responses

### Mock Mode

If you don't have Ollama running, you can enable **Mock Mode** to test the UI with simulated responses:

1. When Ollama is not connected, you'll see a warning banner
2. Click the **"Use Mock Mode"** button in the banner, or
3. Toggle the mock mode switch in the Health Check panel
4. Mock mode generates simulated code responses without requiring Ollama

This is useful for:
- Testing the UI without setting up Ollama
- Development when Ollama is unavailable
- Demonstrating the app to others

### Features

- **Real-time Streaming**: Code appears as it's generated, not all at once
- **Token Tracking**: Token usage displayed in bottom-right corner (prompt + generated tokens)
- **Help Buttons**: Click ℹ️ icons in each panel for detailed explanations
- **Health Checks**: Automatic dependency verification on startup
- **Debug Panel**: View raw prompts and responses for learning

## 🏗️ Project Structure

```
learn-singlepage-codeassistant/
├── .gitignore                # Git ignore rules
├── README.md                 # This file - main documentation
├── SETUP.md                  # Detailed setup instructions
├── CLAUDE.md                 # Project instructions for AI assistants
├── index.html                # Landing page with Overview and Demo tabs
├── demo.mp4                  # Demo video (~3.5MB)
└── my-agent-app/             # Main application directory
    ├── package.json          # Dependencies and scripts
    ├── package-lock.json     # Dependency lock file
    ├── vite.config.js        # Vite configuration
    ├── index.html            # App entry point
    ├── README.md             # App-specific documentation
    ├── CLAUDE.md             # App-specific instructions
    ├── public/
    │   └── vite.svg          # Vite logo
    └── src/
        ├── App.jsx           # Main component with token counter
        ├── App.css           # App styles
        ├── index.jsx         # React entry point
        ├── index.css         # Global styles
        ├── components/
        │   ├── CodeViewer.jsx    # Monaco editor wrapper
        │   ├── DebugPanel.jsx    # Raw prompt/response viewer
        │   ├── ErrorBoundary.jsx # Crash prevention
        │   ├── GoalInput.jsx     # Goal form with examples
        │   ├── HealthCheck.jsx   # Dependency status
        │   └── HelpButton.jsx   # Help modal component
        ├── hooks/
        │   └── useOllama.js      # Ollama state management with streaming
        ├── utils/
        │   ├── codeParser.js     # Extract code from LLM
        │   ├── healthCheck.js    # Dependency verification
        │   ├── logger.js         # Structured logging
        │   └── ollama.js         # Ollama API client with streaming
        └── data/
            └── examples.js       # Example goals
```

## 🔧 Development

### Enable Debug Logging

Open browser DevTools console and type:

```javascript
enableDebug()
```

### Test Ollama Connection

```bash
curl http://localhost:11434/api/tags
```

### Generate Code Manually

```bash
curl http://localhost:11434/api/generate \
  -d '{"model":"phi3:latest","prompt":"Write a function that adds two numbers","stream":true}'
```

**Note:** The app uses streaming by default to show real-time code generation.

## 🗺️ Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Ollama integration + UI | ✅ Current |
| 2 | Web Worker sandbox + test runner | 🔜 Next |
| 3 | IndexedDB persistence + Redux | Planned |
| 4 | Embeddings + memory search | Planned |
| 5 | Full agent loop | Planned |

## 📚 Learning Resources

- [Ollama Documentation](https://ollama.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [React Hooks](https://react.dev/reference/react)
- [Vite Guide](https://vitejs.dev/guide/)

## 🐛 Troubleshooting

### Ollama not connecting

1. Ensure Ollama is running: `ollama serve`
2. Check port 11434 is available
3. Try mock mode to verify UI works

### Model not found

Run `ollama pull phi3:latest` and wait for download. The app defaults to `phi3:latest` for better laptop performance.

### Slow generation

Code LLama 7B requires decent hardware. Consider:
- Using a smaller model
- Running on GPU if available
- Using mock mode for UI testing
 