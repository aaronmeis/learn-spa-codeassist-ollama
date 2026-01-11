/**
 * Ollama API Integration
 * 
 * Handles communication with the local Ollama server.
 * 
 * IMPORTANT NOTES:
 * - Ollama must be running locally: `ollama serve`
 * - Default endpoint: http://localhost:11434
 * - Use `stream: false` to get a single JSON response
 * - Without stream: false, Ollama returns newline-delimited JSON (NDJSON)
 */

import { logger } from './logger.js';

const OLLAMA_BASE_URL = 'http://localhost:11434';
export const DEFAULT_MODEL = 'phi3:latest'; // Changed from codellama:7b for better laptop performance
const DEFAULT_TIMEOUT = 60000; // 60 seconds for code generation

/**
 * Prompt templates for different operations
 */
export const PROMPTS = {
  codeGeneration: (goal, context = '') => `You are a JavaScript code generator. Generate ONLY executable code, no explanations.

TASK: ${goal}
${context ? `\nCONTEXT FROM PREVIOUS ATTEMPTS:\n${context}` : ''}

Requirements:
- Write clean, working JavaScript code
- Include the function definition
- Do not include any explanation, only code
- Wrap your code in \`\`\`javascript ... \`\`\`

Respond with ONLY the JavaScript code:`,

  reflection: (error, similarFixes = []) => `You are debugging JavaScript code. Analyze this error and suggest a fix.

ERROR: ${error}

${similarFixes.length > 0 ? `SIMILAR PAST FIXES:\n${JSON.stringify(similarFixes, null, 2)}` : ''}

Provide a brief hypothesis for what went wrong and how to fix it. Be concise.`,
};

/**
 * Call Ollama API to generate a response
 * 
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Configuration options
 * @param {string} options.model - Model to use (default: phi3:latest)
 * @param {boolean} options.stream - Whether to stream response (default: true)
 * @param {Function} options.onChunk - Callback for streaming chunks: (chunk: string) => void
 * @param {number} options.timeout - Request timeout in ms (default: 60000)
 * @param {boolean} options.useMock - Force mock response (for testing/offline)
 * @returns {Promise<{success: boolean, response: string, error: string|null, duration: number}>}
 */
export async function callOllama(prompt, options = {}) {
  const {
    model = DEFAULT_MODEL,
    stream = true, // Default to streaming for real-time updates
    onChunk = null,
    timeout = DEFAULT_TIMEOUT,
    useMock = false
  } = options;

  const startTime = Date.now();
  
  logger.ollama('request', { 
    model, 
    promptLength: prompt.length,
    promptPreview: prompt.slice(0, 100) + '...',
    stream,
    useMock
  });

  // Mock mode for testing/offline development
  if (useMock) {
    return getMockResponse(prompt);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream, // IMPORTANT: false = single JSON response, true = NDJSON stream
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Ollama returned HTTP ${response.status}: ${response.statusText}`);
    }

    let responseText;
    let tokens = { prompt: 0, generated: 0, total: 0 };
    
    if (stream) {
      // Handle streaming NDJSON response with real-time callbacks
      const streamResult = await handleStreamingResponse(response, onChunk);
      responseText = streamResult.response;
      tokens = streamResult.tokens;
    } else {
      // Handle single JSON response
      const data = await response.json();
      responseText = data.response;
      tokens = {
        prompt: data.prompt_eval_count || 0,
        generated: data.eval_count || 0,
        total: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      };
    }

    const duration = Date.now() - startTime;
    
    logger.ollama('response', { 
      success: true, 
      responseLength: responseText.length,
      duration: `${duration}ms`,
      tokens: tokens.total,
      responsePreview: responseText.slice(0, 100) + '...'
    });

    return {
      success: true,
      response: responseText,
      error: null,
      duration,
      tokens
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    
    let errorMessage;
    if (error.name === 'AbortError') {
      errorMessage = `Request timed out after ${timeout}ms`;
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Cannot connect to Ollama. Is it running? Try: ollama serve';
    } else {
      errorMessage = error.message;
    }

    logger.ollama('error', { error: errorMessage, duration: `${duration}ms` });

    return {
      success: false,
      response: '',
      error: errorMessage,
      duration,
      tokens: { prompt: 0, generated: 0, total: 0 }
    };
  }
}

/**
 * Handle streaming NDJSON response from Ollama
 * @param {Response} response - Fetch response object
 * @param {Function|null} onChunk - Optional callback for each chunk: (chunk: string) => void
 * @returns {Promise<{response: string, tokens: {prompt: number, generated: number, total: number}}>}
 */
async function handleStreamingResponse(response, onChunk = null) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = '';
  let promptTokens = 0;
  let generatedTokens = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.trim());

    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        if (json.response) {
          fullResponse += json.response;
          // Call callback with new chunk for real-time updates
          if (onChunk) {
            onChunk(json.response);
          }
        }
        // Capture token counts from the final chunk (when done: true)
        if (json.done) {
          promptTokens = json.prompt_eval_count || 0;
          generatedTokens = json.eval_count || 0;
        }
      } catch {
        // Skip malformed JSON lines
      }
    }
  }

  return {
    response: fullResponse,
    tokens: {
      prompt: promptTokens,
      generated: generatedTokens,
      total: promptTokens + generatedTokens
    }
  };
}

/**
 * Generate a mock response for testing/offline mode
 * @param {string} prompt - The prompt (used to determine mock type)
 * @returns {{success: boolean, response: string, error: null, duration: number}}
 */
function getMockResponse(prompt) {
  logger.ollama('mock-response', { note: 'Using mock response for testing' });
  
  // Simulate some processing time
  const mockDelay = 500 + Math.random() * 1000;
  
  // Generate appropriate mock based on prompt content
  let mockCode;
  
  if (prompt.toLowerCase().includes('add') || prompt.toLowerCase().includes('sum')) {
    mockCode = `\`\`\`javascript
function add(a, b) {
  return a + b;
}
\`\`\``;
  } else if (prompt.toLowerCase().includes('reverse')) {
    mockCode = `\`\`\`javascript
function reverse(str) {
  return str.split('').reverse().join('');
}
\`\`\``;
  } else if (prompt.toLowerCase().includes('fibonacci')) {
    mockCode = `\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\``;
  } else {
    mockCode = `\`\`\`javascript
// Mock generated code for: ${prompt.slice(0, 50)}...
function solution(input) {
  // TODO: Implement solution
  return input;
}
\`\`\``;
  }

  // Estimate mock tokens (rough approximation: ~4 chars per token)
  const estimatedTokens = Math.ceil(mockCode.length / 4);

  return {
    success: true,
    response: mockCode,
    error: null,
    duration: mockDelay,
    tokens: {
      prompt: Math.ceil(prompt.length / 4),
      generated: estimatedTokens,
      total: Math.ceil(prompt.length / 4) + estimatedTokens
    }
  };
}

/**
 * Generate code for a given goal
 * @param {string} goal - Description of what the code should do
 * @param {string} context - Optional context from previous attempts
 * @param {Object} options - Ollama options (supports onChunk callback for streaming)
 * @returns {Promise<{success: boolean, response: string, error: string|null, duration: number}>}
 */
export async function generateCode(goal, context = '', options = {}) {
  const prompt = PROMPTS.codeGeneration(goal, context);
  // Ensure streaming is enabled by default unless explicitly disabled
  const streamOptions = { stream: true, ...options };
  return callOllama(prompt, streamOptions);
}

/**
 * Generate reflection/analysis for an error
 * @param {string} error - The error message
 * @param {Array} similarFixes - Similar fixes from memory
 * @param {Object} options - Ollama options
 * @returns {Promise<{success: boolean, response: string, error: string|null, duration: number}>}
 */
export async function generateReflection(error, similarFixes = [], options = {}) {
  const prompt = PROMPTS.reflection(error, similarFixes);
  return callOllama(prompt, { ...options, timeout: 30000 }); // Shorter timeout for reflection
}

/**
 * Check if Ollama is available and responding
 * @returns {Promise<boolean>}
 */
export async function isOllamaAvailable() {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

export default {
  callOllama,
  generateCode,
  generateReflection,
  isOllamaAvailable,
  PROMPTS,
  OLLAMA_BASE_URL,
  DEFAULT_MODEL
};
