# Self-Improving Coding Agent MVP

A browser-based, self-improving coding agent that uses local LLM inference (Ollama) to autonomously generate, test, and refine code through an agentic loop.

![Overview](./unnamed9.png)

> **Current Phase: 1 - Hello Ollama**  
> Basic LLM integration with health checks, logging, and simple UI.

## 🚀 Quick Start

> **📖 New to the project?** See [../SETUP.md](../SETUP.md) for detailed step-by-step setup instructions.

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
npm install        # Install dependencies
npm run dev        # Start development server
```

Open http://localhost:5173 in your browser.

> **Note:** See [../SETUP.md](../SETUP.md) for detailed setup instructions and troubleshooting.

## 📖 Usage

1. **Check System Status** - The health panel shows if Ollama is connected
2. **Enter a Goal** - Describe what code you want (or use an example)
3. **Generate Code** - Click the button to send to Ollama
4. **View Results** - See generated code stream in real-time in the Monaco editor
5. **Monitor Tokens** - Token usage is displayed in the bottom-right corner after generation
6. **Debug** - Expand the debug panel to see raw prompts/responses

### Mock Mode

If you don't have Ollama running, enable **Mock Mode** to test the UI with simulated responses.

### Features

- **Real-time Streaming**: Code appears as it's generated, not all at once
- **Token Tracking**: Token usage displayed in bottom-right corner (prompt + generated tokens)
- **Help Buttons**: Click ℹ️ icons in each panel for detailed explanations
- **Health Checks**: Automatic dependency verification on startup
- **Debug Panel**: View raw prompts and responses for learning

## 🏗️ Project Structure

```
my-agent-app/
├── CLAUDE.md                 # Claude Code instructions
├── src/
│   ├── components/
│   │   ├── CodeViewer.jsx    # Monaco editor wrapper
│   │   ├── DebugPanel.jsx    # Raw prompt/response viewer
│   │   ├── ErrorBoundary.jsx # Crash prevention
│   │   ├── GoalInput.jsx     # Goal form with examples
│   │   └── HealthCheck.jsx   # Dependency status
│   ├── hooks/
│   │   └── useOllama.js      # Ollama state management
│   ├── utils/
│   │   ├── codeParser.js     # Extract code from LLM
│   │   ├── healthCheck.js    # Dependency verification
│   │   ├── logger.js         # Structured logging
│   │   └── ollama.js         # Ollama API client
│   ├── data/
│   │   └── examples.js       # Example goals
│   ├── App.jsx               # Main component
│   └── index.jsx             # Entry point
└── package.json
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
 
