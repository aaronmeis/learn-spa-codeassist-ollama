# CLAUDE.md - Self-Improving Coding Agent MVP

## Project Overview

Build a browser-based, self-improving coding agent that uses local LLM inference (Ollama) to autonomously generate, test, and refine code through an agentic loop. The app runs entirely client-side with persistent storage via IndexedDB and semantic memory search using vector embeddings.

**This is a learning/MVP project.** The build is phased to introduce concepts incrementally.

## Current Phase: 1 - Hello Ollama

Focus: Basic LLM integration with health checks, logging, and simple UI.

## Tech Stack

- **Framework:** React 18+ with Vite
- **State Management:** React Context + useReducer (Phase 1-2), Redux Toolkit (Phase 3+)
- **Database:** IndexedDB via Dexie.js (Phase 3+)
- **LLM Integration:** Ollama API (local, http://localhost:11434)
- **Embeddings:** @xenova/transformers (Phase 4+)
- **Code Editor:** Monaco Editor (@monaco-editor/react)
- **Sandbox:** Web Workers (Phase 2+)
- **Optional:** LangChain.js (Phase 5+)

## Architecture

```
[User Input: Goal & Tests] --> [React UI: Input Form, Dashboard, Viewers]
                                        |
                                        v
[React Context: App State] <--> [IndexedDB: Sessions, Iterations, Memories]
                                        |
                                        v
                            [Agent Loop Orchestrator]
                            - Plan: Ollama API → Generate Code
                            - Execute: Web Worker Sandbox → Run Code
                            - Test: Compare Outputs → Pass/Fail
                            - Reflect: Embed Error → Cosine Similarity → Hypothesize Fix
                                        |
                                        v
                [UI Updates: Real-Time Progress, Code Display, Memory Insights]
```

## Project Structure

```
my-agent-app/
├── CLAUDE.md                        # This file - project instructions
├── docs/
│   ├── README.md                    # Setup and run instructions
│   ├── deployment.md                # Deployment guide
│   └── architecture/
│       ├── agent-loop.md            # Mermaid diagram for loop flow
│       ├── storage.md               # IndexedDB schema diagram
│       └── overall.md               # High-level architecture diagram
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── GoalInput.jsx            # Form for goal/test input
│   │   ├── TestCaseInput.jsx        # Define test cases (Phase 2+)
│   │   ├── ProgressDashboard.jsx    # Iteration progress display (Phase 3+)
│   │   ├── CodeViewer.jsx           # Monaco editor integration
│   │   ├── MemoryInsights.jsx       # Memory search and display (Phase 4+)
│   │   ├── DebugPanel.jsx           # Show raw prompts/responses
│   │   ├── HealthCheck.jsx          # Dependency status
│   │   └── ErrorBoundary.jsx        # Crash prevention
│   ├── hooks/
│   │   ├── useAgent.js              # Custom hook for agent state (Phase 3+)
│   │   └── useOllama.js             # Connection status hook
│   ├── context/
│   │   └── AgentContext.jsx         # App state context (Phase 1-2)
│   ├── features/
│   │   └── agent/
│   │       └── agentSlice.js        # Redux slice (Phase 3+)
│   ├── utils/
│   │   ├── ollama.js                # Ollama API calls
│   │   ├── codeParser.js            # Extract code from LLM response
│   │   ├── logger.js                # Structured logging
│   │   ├── healthCheck.js           # Dependency checks
│   │   ├── testRunner.js            # Test case execution (Phase 2+)
│   │   ├── embed.js                 # Embedding generation (Phase 4+)
│   │   └── db.js                    # IndexedDB setup (Phase 3+)
│   ├── workers/
│   │   └── sandboxWorker.js         # Web Worker sandbox (Phase 2+)
│   ├── data/
│   │   └── examples.js              # Starter goals
│   ├── App.jsx                      # Main app
│   ├── App.css                      # Styles
│   ├── index.jsx                    # Entry point
│   └── index.css                    # Global styles
├── package.json
└── vite.config.js
```

## Phased Build Plan

| Phase | Focus | Key Learnings | Status |
|-------|-------|---------------|--------|
| 1 | Ollama integration + simple UI | LLM API basics, health checks, logging | **CURRENT** |
| 2 | Web Worker sandbox + test runner | Isolation, async messaging, code execution | Pending |
| 3 | IndexedDB persistence + Redux | Browser storage, state management at scale | Pending |
| 4 | Embeddings + memory search | Vector search, ML in browser | Pending |
| 5 | Full agent loop | Autonomous systems, reflection | Pending |

---

## Phase 1: Hello Ollama

### Goals
- [x] Connect to local Ollama instance
- [x] Send prompts and receive responses
- [x] Handle streaming vs non-streaming responses
- [x] Extract code from markdown-wrapped LLM responses
- [x] Health check system for dependencies
- [x] Structured logging for debugging
- [x] Basic UI with goal input and code display
- [x] Example goals for quick testing
- [x] Error boundary for crash prevention

### Key Files (Phase 1)

#### src/utils/ollama.js
```javascript
// Ollama API integration
// IMPORTANT: Use stream: false to get JSON response, or handle NDJSON streaming
// Endpoint: POST http://localhost:11434/api/generate
// Body: { model: 'codellama:7b', prompt: string, stream: false }

export async function callOllama(prompt, options = {}) {
  const { model = 'codellama:7b', stream = false } = options;
  // ... implementation with proper error handling and mock fallback
}

export async function checkOllamaConnection() {
  // GET http://localhost:11434/api/tags to verify Ollama is running
}
```

#### src/utils/codeParser.js
```javascript
// Extract code from LLM responses (they wrap code in markdown)
export function extractCode(response) {
  const match = response.match(/```(?:javascript|js)?\n([\s\S]*?)```/);
  return match ? match[1].trim() : response.trim();
}
```

#### src/utils/logger.js
```javascript
// Structured logging for learning/debugging
export const logger = {
  agent: (stage, data) => console.log(`🤖 [${stage}]`, data),
  ollama: (event, data) => console.log(`🦙 [${event}]`, data),
  ui: (component, data) => console.log(`🖥️ [${component}]`, data),
};
```

#### src/utils/healthCheck.js
```javascript
// Check all dependencies before user gets frustrated
export async function checkDependencies() {
  return {
    ollama: await checkOllama(),      // Is Ollama running?
    indexedDB: checkIndexedDB(),       // Is IndexedDB available?
    worker: checkWorkerSupport(),      // Are workers supported?
  };
}
```

#### src/hooks/useOllama.js
```javascript
// Custom hook for Ollama state and operations
export function useOllama() {
  // Returns: { isConnected, isLoading, error, generate, checkConnection }
}
```

#### src/data/examples.js
```javascript
// Starter examples for quick testing
export const EXAMPLE_GOALS = [
  {
    id: 'add-numbers',
    goal: "Write a function called 'add' that takes two numbers and returns their sum",
    tests: [{ input: [2, 3], expected: 5 }],
    difficulty: 'easy'
  },
  // ...more examples
];
```

### Prompt Templates (Phase 1)

```javascript
// Simple code generation prompt
const CODE_GEN_PROMPT = `You are a JavaScript code generator. Generate ONLY executable code, no explanations.

TASK: {goal}

Requirements:
- Write clean, working JavaScript code
- Include the function definition
- Do not include any explanation, only code
- Wrap code in \`\`\`javascript ... \`\`\`

Respond with ONLY the JavaScript code:`;
```

---

## Common Pitfalls (Learning Notes)

1. **Ollama Streaming:** Use `stream: false` in request body, or handle NDJSON (newline-delimited JSON) responses
2. **Ollama Not Running:** Always check connection before making requests - users forget to start it
3. **Code Extraction:** LLMs wrap code in markdown code blocks - always parse it out
4. **CORS Issues:** Ollama allows localhost by default, but check if you have issues
5. **Model Not Downloaded:** First run requires `ollama pull codellama:7b` (~4GB download)
6. **Embeddings are Slow:** First load downloads ~30MB model - show loading state (Phase 4)
7. **Worker Termination:** Always `.terminate()` workers to prevent memory leaks (Phase 2)
8. **IndexedDB Versioning:** Increment version number when changing schema (Phase 3)

## Debugging Tips

- Open DevTools → Console to see structured logs
- Open DevTools → Network to inspect Ollama API calls
- Test Ollama independently:
  ```bash
  curl http://localhost:11434/api/generate -d '{"model":"codellama:7b","prompt":"Write a hello world function in JavaScript","stream":false}'
  ```
- Check Ollama is running: `curl http://localhost:11434/api/tags`
- Enable verbose logging: Set `localStorage.setItem('DEBUG', 'true')` in console
- Phase 3+: Open DevTools → Application → IndexedDB to inspect stored data

## Milestones Checklist

### Phase 1: Hello Ollama ✅
- [x] Vite + React project setup
- [x] Health check component showing Ollama status
- [x] Goal input form with example goals
- [x] Ollama API integration with error handling
- [x] Code extraction from LLM responses
- [x] Code viewer displaying generated code
- [x] Debug panel showing raw prompts/responses
- [x] Structured logging throughout
- [x] Error boundary preventing crashes

### Phase 2: Sandbox Execution (Next)
- [ ] Web Worker sandbox setup
- [ ] Code execution with timeout protection
- [ ] Test case input component
- [ ] Test runner comparing outputs
- [ ] Display pass/fail results

### Phase 3: Persistence
- [ ] IndexedDB setup with Dexie.js
- [ ] Session storage (goals, iterations)
- [ ] Migrate to Redux Toolkit
- [ ] Hydration on app load
- [ ] Resume previous sessions

### Phase 4: Memory & Embeddings
- [ ] Transformers.js integration
- [ ] Generate embeddings for errors
- [ ] Cosine similarity search
- [ ] Memory insights UI
- [ ] Embedding visualization (optional)

### Phase 5: Full Agent Loop
- [ ] Plan → Execute → Test → Reflect cycle
- [ ] Circuit breaker (stop on repeated errors)
- [ ] Context accumulation across iterations
- [ ] Success/failure memory storage
- [ ] Autonomous operation until success

## Commands

```bash
# Setup (Phase 1)
npm create vite@latest my-agent-app -- --template react
cd my-agent-app
npm install @monaco-editor/react

# Development
npm run dev

# Ollama (separate terminal) - REQUIRED
ollama pull codellama:7b  # First time only, downloads ~4GB
ollama serve              # Start the server (or use `ollama run codellama:7b`)

# Test Ollama is working
curl http://localhost:11434/api/tags

# Production build
npm run build
```

## Phase 2+ Dependencies (Install When Needed)

```bash
# Phase 2: Sandbox
# (No additional deps - Web Workers are built-in)

# Phase 3: Persistence + State
npm install dexie redux @reduxjs/toolkit react-redux

# Phase 4: Embeddings
npm install @xenova/transformers

# Phase 5: Optional LangChain
npm install @langchain/core @langchain/community
```

## Key Learning Concepts

1. **LLM API Integration:** HTTP requests to local inference servers, handling responses
2. **Health Checks:** Verifying dependencies before operations
3. **Defensive Coding:** Error boundaries, fallbacks, graceful degradation
4. **Structured Logging:** Debugging complex async flows
5. **Code Parsing:** Extracting useful content from LLM responses
6. **React Patterns:** Custom hooks, context, error boundaries

## Extension Ideas (Post-MVP)

- Add Tailwind CSS for styling
- Implement LangChain for multi-step reasoning chains
- Bundle vm2 for stricter sandbox isolation
- Add Cypress for E2E testing
- Create Docker Compose for app + Ollama
- Add GitHub Actions for CI/CD
- Embedding visualization with UMAP projection
- Export/import sessions as JSON
- Multiple model support (switch between codellama, mistral, etc.)
